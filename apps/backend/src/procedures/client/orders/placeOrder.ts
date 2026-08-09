import { getDB } from "@/db/db";
import { orderItems, orders } from "@/db/schema";
import { payments } from "@/db/schema/payments";
import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { generateOrderId } from "@/utils/generateId";
import { verifyRazorpaySignature } from "@/utils/verifyRazorpay";
import { OrderRequestSchema as PlaceOrderRequestSchema } from "@lobango/contracts";
import { z } from "zod";

const PlaceOrderResponseSchema = z.object({
  success: z.boolean(),
  orderId: z.string(),
  totalAmount: z.string(),
  createdAt: z.string(),
  message: z.string(),
});

export const placeOrder = orpc
  .route({
    method: "POST",
    path: "/order",
    summary: "Place New Order",
    description: "Add/Place a new order in the DB",
    tags: [API_TAGS.ORDERS],
  })
  .input(PlaceOrderRequestSchema)
  .output(PlaceOrderResponseSchema)
  .errors({
    BAD_REQUEST: { message: "Missing Razorpay payment details" },
  })
  .handler(async ({ input, context, errors }) => {
    const db = getDB(context.env.DB);
    const { order, razorpay } = input;

    const createdAt = new Date().toISOString();
    const totalAmount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (order.paymentMethod === "razorpay") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        razorpay;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw errors.BAD_REQUEST({
          message: "Missing Razorpay payment details",
        });
      }

      const isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        context.env.RAZORPAY_SECRET_KEY
      );

      if (!isValid) {
        throw errors.BAD_REQUEST({
          message: "Invalid Razorpay payment signature",
        });
      }
    }

    let orderId: string;
    while (true) {
      orderId = generateOrderId();
      const existing = await db.query.orders.findFirst({
        where: (fields, { eq }) => eq(fields.orderId, orderId),
      });
      if (!existing) break;
    }

    const insertOrderQuery = db.insert(orders).values({
      orderId,
      customerName: order.customerName.trim(),
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress.trim(),
      longitude: order.longitude,
      latitude: order.latitude,
      totalAmount,
      customerEmail: order.customerEmail,
      status: "pending",
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentMethod === "razorpay" ? "paid" : "pending",
      createdAt,
    });

    const insertPaymentQuery = db.insert(payments).values({
      orderId,
      razorpayOrderId:
        order.paymentMethod === "razorpay" ? razorpay.razorpay_order_id : null,
      razorpayPaymentId:
        order.paymentMethod === "razorpay"
          ? razorpay.razorpay_payment_id
          : null,
      razorpaySignature:
        order.paymentMethod === "razorpay" ? razorpay.razorpay_signature : null,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentMethod === "razorpay" ? "paid" : "pending",
      createdAt,
    });

    const insertItemQueries = order.items.map((item) =>
      db.insert(orderItems).values({
        orderId,
        name: item.name.trim(),
        price: item.price.toString(),
        quantity: item.quantity.toString(),
      })
    );

    await db.batch([
      insertOrderQuery,
      insertPaymentQuery,
      ...insertItemQueries,
    ]);

    // [TODO] : implement queue to handle this
    // await sendOrderEmail({
    //   env: context.env,
    //   to: order.customerEmail,
    //   name: order.customerName,
    //   total: totalAmount.toString(),
    //   orderId,
    //   customerPhone: order.customerPhone,
    //   customerAddress: order.customerAddress.trim(),
    // });

    return {
      success: true,
      orderId,
      totalAmount: totalAmount.toString(),
      createdAt,
      message: "Order placed successfully",
    };
  });

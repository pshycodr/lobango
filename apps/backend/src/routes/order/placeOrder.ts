import { HttpStatus } from "@/constants/httpStatusCodes";
import { OrderRequestSchema } from "@lobango/contracts/order";
import crypto from "crypto";
import { Context } from "hono";
import { customAlphabet } from "nanoid";
import { getDB } from "../../db/db";
import { orderItems } from "../../db/schema/orderItems";
import { orders } from "../../db/schema/orders";
import { sendOrderEmail } from "../../utils/sendEmail";

export interface Env {
  DB: D1Database;
}

// NanoID generator for readable order IDs
const generateOrderId = () => {
  const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);
  return `ORD_${nanoid()}`;
};

// Helper to verify Razorpay signature
function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
) {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

export async function placeOrder(c: Context) {
  try {
    const body = await c.req.json();
    console.log(body);

    const parsed = OrderRequestSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.message }, HttpStatus.BadRequest);
    }

    const { order, razorpay } = parsed.data;
    const db = getDB(c.env.DB);

    const createdAt = new Date().toISOString();

    const totalAmount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (order.paymentMethod === "razorpay") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        razorpay;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return c.json(
          { error: "Missing Razorpay payment details" },
          HttpStatus.BadRequest
        );
      }

      const RAZORPAY_SECRET = c.env.RAZORPAY_SECRET_KEY;

      const isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        RAZORPAY_SECRET
      );

      if (!isValid) {
        return c.json(
          { error: "Invalid Razorpay payment signature" },
          HttpStatus.BadRequest
        );
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
      razorpayOrderId: razorpay.razorpay_order_id ?? null,
      razorpayPaymentId: razorpay.razorpay_payment_id ?? null,
      razorpaySignature: razorpay.razorpay_signature ?? null,
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

    await db.batch([insertOrderQuery, ...insertItemQueries]);

    await sendOrderEmail({
      env: c.env,
      to: order.customerEmail,
      name: order.customerName,
      total: totalAmount.toString(),
      orderId,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress.trim(),
    });

    return c.json(
      {
        success: true,
        orderId,
        totalAmount,
        createdAt,
        message: "Order placed successfully",
      },
      HttpStatus.Ok
    );
  } catch (error) {
    console.error("Order Placement Failed", {
      error,
      timestamp: new Date().toISOString(),
    });

    return c.json(
      { error: "Internal Server Error" },
      HttpStatus.InternalServerError
    );
  }
}

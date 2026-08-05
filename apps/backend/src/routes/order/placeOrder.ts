import { D1Database } from "@cloudflare/workers-types";
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
  secret: string,
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
      return c.json({ error: parsed.error.message }, 400);
    }

    const { order, razorpay } = parsed.data;
    const db = getDB(c.env.DB);
    const created_at = new Date().toISOString();
    const total_amount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (order.paymentMethod === "razorpay") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        razorpay;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return c.json({ error: "Missing Razorpay payment details" }, 400);
      }
      const RAZORPAY_SECRET = c.env.RAZORPAY_SECRET_KEY;
      const isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        RAZORPAY_SECRET,
      );

      if (!isValid) {
        return c.json({ error: "Invalid Razorpay payment signature" }, 400);
      }
    }

    let order_id: string;
    while (true) {
      order_id = generateOrderId();
      const existing = await db.query.orders.findFirst({
        where: (fields, { eq }) => eq(fields.order_id, order_id),
      });
      if (!existing) break;
    }

    // Create batch of queries
    const insertOrderQuery = db.insert(orders).values({
      order_id,
      customer_name: order.customerName.trim(),
      customer_phone: order.customerPhone,
      customer_address: order.customerAddress.trim(),
      longitude: order.longitude,
      latitude: order.latitude,
      total_amount,
      customer_email: order.customerEmail,
      status: "pending",
      payment_method: order.paymentMethod,
      payment_status: order.paymentMethod === "razorpay" ? "paid" : "pending",
      razorpay_order_id: razorpay.razorpay_order_id ?? null,
      razorpay_payment_id: razorpay.razorpay_payment_id ?? null,
      razorpay_signature: razorpay.razorpay_signature ?? null,
      created_at,
    });

    const insertItemQueries = order.items.map((item) =>
      db.insert(orderItems).values({
        order_id,
        name: item.name.trim(),
        price: item.price.toString(),
        quantity: item.quantity.toString(),
      }),
    );

    // Execute batch
    await db.batch([insertOrderQuery, ...insertItemQueries]);

    await sendOrderEmail({
      env: c.env,
      to: order.customerEmail,
      name: order.customerName,
      total: total_amount.toString(),
      orderId: order_id,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress.trim(),
    });

    return c.json({
      success: true,
      orderId: order_id,
      totalAmount: total_amount,
      createdAt: created_at,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Order Placement Failed", {
      error,
      timestamp: new Date().toISOString(),
    });
    return c.json({ error: "Internal Server Error" }, 500);
  }
}

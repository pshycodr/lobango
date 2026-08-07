import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

export const orders = sqliteTable("orders", {
  id: int("id").primaryKey({ autoIncrement: true }),
  orderId: text("order_id").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  customerEmail: text("customer_email").notNull(),
  longitude: text("longitude").default("none"),
  latitude: text("latitude").default("none"),
  totalAmount: real("total_amount").notNull(),
  status: text("status").default("pending"),
  createdAt: text("created_at"),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").default("pending"),
  razorpaySignature: text("razorpay_signature"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpayOrderId: text("razorpay_order_id"),
});

export const OrdersSelectSchema = createSelectSchema(orders);

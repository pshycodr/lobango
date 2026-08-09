import {
  paymentMethodValues,
  paymentStatusValues,
} from "@lobango/contracts/enums";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { orders } from "./orders";

export const payments = sqliteTable("payments", {
  id: int("id").primaryKey({ autoIncrement: true }),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.orderId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  paymentMethod: text("payment_method", { enum: paymentMethodValues }),
  paymentStatus: text("payment_status", { enum: paymentStatusValues }).default(
    "pending"
  ),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  createdAt: text("created_at"),
});

export const PaymentsSelectSchema = createSelectSchema(payments);

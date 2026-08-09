import {
  orderStatusValues,
  paymentMethodValues,
  paymentStatusValues,
} from "@lobango/contracts/enums";
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
  paymentMethod: text("payment_method", { enum: paymentMethodValues }),
  paymentStatus: text("payment_status", { enum: paymentStatusValues }).default(
    "pending"
  ),
  createdAt: text("created_at"),
  status: text("status", { enum: orderStatusValues }).default("pending"),
});

export const OrdersSelectSchema = createSelectSchema(orders);

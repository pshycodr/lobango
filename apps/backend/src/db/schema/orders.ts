import {
  orderStatusValues,
  paymentMethodValues,
  paymentStatusValues,
} from "@lobango/contracts/enums";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
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
  totalAmount: text("total_amount").notNull(),
  paymentMethod: text("payment_method", {
    enum: paymentMethodValues,
  }).notNull(),
  paymentStatus: text("payment_status", { enum: paymentStatusValues })
    .default("pending")
    .notNull(),
  createdAt: text("created_at").notNull(),
  status: text("status", { enum: orderStatusValues })
    .default("pending")
    .notNull(),
});

export const OrdersSelectSchema = createSelectSchema(orders);

import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const orders = sqliteTable("orders", {
  id: int("id").primaryKey({ autoIncrement: true }),
  order_id: text("order_id").notNull().unique(),
  customer_name: text("customer_name").notNull(),
  customer_phone: text("customer_phone").notNull(),
  customer_address: text("customer_address").notNull(),
  customer_email: text("customer_email").notNull(),
  longitude: text("longitude").default("none"),
  latitude: text("latitude").default("none"),
  total_amount: real("total_amount").notNull(),
  status: text("status").default("pending"),
  payment_method: text("payment_method"),
  payment_status: text("payment_status").default("pending"),
  created_at: text("created_at"),
  razorpay_signature: text("razorpay_signature"),
  razorpay_payment_id: text("razorpay_payment_id"),
  razorpay_order_id: text("razorpay_order_id"),
})

import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const orders = sqliteTable("orders", {
  id: int("id").primaryKey({ autoIncrement: true }),
  order_id: text("order_id").notNull().unique(),
  customer_name: text("customer_name").notNull(),
  customer_phone: text("customer_phone").notNull(),
  customer_address: text("customer_address").notNull(),
  total_amount: real("total_amount").notNull(),
  status: text("status").default("pending"),
  payment_method: text("payment_method"),
  payment_status: text("payment_status").default("pending"),
  stripe_payment_id: text("stripe_payment_id"),
  created_at: text("created_at"),
})

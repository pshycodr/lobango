import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";
import { orders } from "./orders";

export const orderItems = sqliteTable("orderItems", {
  id: int("id").primaryKey({ autoIncrement: true }),
  order_id: text("order_id")
    .notNull()
    .references(() => orders.order_id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  name: text("name").notNull(),
  price: text("price").notNull(),
  quantity: text("quantity").default("1"),
});

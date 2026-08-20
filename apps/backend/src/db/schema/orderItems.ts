import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";
import { orders } from "./orders";
import { createSelectSchema } from "drizzle-zod";

export const orderItems = sqliteTable("orderItems", {
  id: int("id").primaryKey({ autoIncrement: true }),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.orderId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  name: text("name").notNull(),
  price: text("price").notNull(),
  quantity: text("quantity").default("1").notNull(),
});

export const orderItemSelectSchema = createSelectSchema(orderItems);

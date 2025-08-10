import { int, sqliteTable } from "drizzle-orm/sqlite-core";

export const permissions = sqliteTable("permissions", {
  id: int("id").primaryKey({ autoIncrement: true }),
  new_orders: int("new_orders", { mode: "boolean" }).notNull().default(true),
  new_bookings: int("new_bookings", { mode: "boolean" }).notNull().default(true),
});

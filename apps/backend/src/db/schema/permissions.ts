import { int, sqliteTable } from "drizzle-orm/sqlite-core";

export const permissions = sqliteTable("permissions", {
  id: int("id").primaryKey({ autoIncrement: true }),
  newOrders: int("new_orders", { mode: "boolean" }).notNull().default(true),
  newBookings: int("new_bookings", { mode: "boolean" }).notNull().default(true),
});

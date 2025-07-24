import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core';

export const bookings = sqliteTable("bookings", {
  id: int("id").primaryKey({ autoIncrement: true }),
  table_id: int("table_id").notNull(),
  customer_name: text("customer_name").notNull(),
  customer_phone: text("customer_phone").notNull(),

  date: text("date").notNull(),            // YYYY-MM-DD
  from_time: text("from_time").notNull(),  // HH:mm
  to_time: text("to_time").notNull(),      // HH:mm

  number_of_people: int("number_of_people").notNull(),
  occasion: text("occasion").default("N/A"),              // optional
  status: text("status").default("pending"),
  created_at: text("created_at").default("CURRENT_TIMESTAMP"),
});

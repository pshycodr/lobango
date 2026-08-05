import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const bookings = sqliteTable("bookings", {
  id: int("id").primaryKey({ autoIncrement: true }),
  booking_id: text("booking_id").notNull().unique(),
  customer_name: text("customer_name").notNull(),
  customer_phone: text("customer_phone").notNull(),
  customer_email: text("customer_email").notNull(),

  date: text("date").notNull(), // YYYY-MM-DD
  time: text("time").notNull(), // HH:mm

  number_of_people: int("number_of_people").notNull(),
  message: text("message").default("N/A"), // optional
  status: text("status").default("pending"),
  created_at: text("created_at").default("CURRENT_TIMESTAMP"),
});

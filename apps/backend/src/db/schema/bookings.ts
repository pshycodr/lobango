import { bookingStatusValues } from "@lobango/contracts/enums";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

export const bookings = sqliteTable("bookings", {
  id: int("id").primaryKey({ autoIncrement: true }),
  bookingId: text("booking_id").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").notNull(),

  date: text("date").notNull(), // YYYY-MM-DD
  time: text("time").notNull(), // HH:mm

  numberOfPeople: int("number_of_people").notNull(),
  message: text("message").default("N/A"), // optional
  status: text("status", { enum: bookingStatusValues }).default("pending"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const BookingSelectSchema = createSelectSchema(bookings);

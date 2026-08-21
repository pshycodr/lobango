import { z } from "zod";

export const bookingStatusValues = [
  "pending",
  "accepted",
  "completed",
  "cancelled",
  "rejected",
] as const;

export const BookingStatusSchema = z.enum(bookingStatusValues);

export type BookingStatus = z.infer<typeof BookingStatusSchema>;

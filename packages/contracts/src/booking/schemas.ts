import { z } from "zod";
import { BookingStatusSchema } from "../enums";

export const BookingSchema = z.object({
  id: z.number(),
  bookingId: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerEmail: z.email(),
  date: z.string(),
  time: z.string(),
  numberOfPeople: z.number(),
  message: z.string().nullable(),
  status: BookingStatusSchema.nullable(),
  createdAt: z.string().nullable(),
});
export type Booking = z.infer<typeof BookingSchema>;

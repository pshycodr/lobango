import { z } from "zod";
import { BookingStatusSchema } from "../enums";

export const BookingSchema = z.object({
  id: z.number(),
  bookingId: z.string().trim(),
  customerName: z.string().trim().min(1),
  customerPhone: z.string().trim(),
  customerEmail: z.email(),
  date: z.string().trim(),
  time: z.string().trim(),
  numberOfPeople: z.number(),
  message: z.string().trim().nullable(),
  status: BookingStatusSchema,
  createdAt: z.string().trim(),
});
export type Booking = z.infer<typeof BookingSchema>;

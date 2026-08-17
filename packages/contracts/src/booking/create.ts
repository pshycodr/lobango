import { z } from "zod";
import { BookingSchema } from "./schemas";

export const CreateBookingRequestSchema = BookingSchema.pick({
  customerName: true,
  customerPhone: true,
  customerEmail: true,
  numberOfPeople: true,
  message: true,
  date: true,
  time: true,
});

export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>;

export const CreateBookingResponseSchema = z.object({
  success: z.literal(true),
  bookingId: z.string(),
});

export type CreateBookingResponse = z.infer<typeof CreateBookingResponseSchema>;

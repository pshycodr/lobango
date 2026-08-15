import { z } from "zod";
import { BookingSchema } from "./schemas";

export const GetBookingByIdRequestSchema = z.object({
  bookingId: z.string(),
});

export type GetBookingByIdRequest = z.infer<typeof GetBookingByIdRequestSchema>;

export type GetBookingByIdResponse = z.infer<typeof BookingSchema>;

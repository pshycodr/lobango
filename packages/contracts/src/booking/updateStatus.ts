import { z } from "zod";
import { BookingStatusSchema } from "../enums";

export const UpdateBookingStatusRequestSchema = z.object({
  bookingId: z.string(),
  status: BookingStatusSchema,
});

export type UpdateBookingStatusRequest = z.infer<
  typeof UpdateBookingStatusRequestSchema
>;

export const UpdateBookingStatusResponseSchema = z.object({
  success: z.boolean(),
});

export type UpdateBookingStatusResponse = z.infer<
  typeof UpdateBookingStatusResponseSchema
>;

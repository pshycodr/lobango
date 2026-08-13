import { z } from "zod";
import { BookingStatusSchema } from "../enums/booking";

export const GetBookingByIdRequestSchema = z.object({
  bookingId: z.string(),
});

export type GetBookingByIdRequest = z.infer<typeof GetBookingByIdRequestSchema>;

export const GetBookingByIdResponseSchema = z.object({
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

export type GetBookingByIdResponse = z.infer<
  typeof GetBookingByIdResponseSchema
>;

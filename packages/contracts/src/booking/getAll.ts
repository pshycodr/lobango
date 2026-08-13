import { z } from "zod";
import { GetBookingByIdResponseSchema as BookingResponseSchema } from "./getById";

export const GetAllBookingsResponseSchema = z.object({
  success: z.literal(true),
  count: z.number(),
  data: z.array(BookingResponseSchema),
});

export type GetAllBookingsResponse = z.infer<
  typeof GetAllBookingsResponseSchema
>;

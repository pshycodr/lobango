import { z } from "zod";
import { BookingSchema } from "./schemas";

const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

export const GetAllBookingsRequestSchema = z
  .object({
    date: DateSchema.optional().describe("Return Bookings for a specific date"),

    from: DateSchema.optional().describe("Start date for the order date range"),

    to: DateSchema.optional().describe("End date for the order date range"),
  })
  .refine(({ from, to }) => !((from && !to) || (!from && to)), {
    message: "`from` and `to` must be provided together",
  })
  .refine(({ date, from, to }) => !(date && (from || to)), {
    message: "`date` cannot be combined with `from` or `to`",
  });

export type GetAllBookingsRequest = z.infer<typeof GetAllBookingsRequestSchema>;

export const GetAllBookingsResponseSchema = z.object({
  success: z.literal(true),
  count: z.number(),
  data: z.array(BookingSchema),
});

export type GetAllBookings = z.infer<typeof BookingSchema>;

export type GetAllBookingsResponse = z.infer<
  typeof GetAllBookingsResponseSchema
>;

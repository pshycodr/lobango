import { getDB } from "@/db/db";
import { BookingSelectSchema } from "@/db/schema";
import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { z } from "zod";

const GetBookingInput = z.object({
  bookingId: z.string().trim(),
});

const GetBookingOutput = z.object({
  success: z.literal(true),
  booking: BookingSelectSchema,
});

type GetBookingResult = z.infer<typeof GetBookingOutput>;

const BOOKING_CACHE_TTL_SECONDS = 60 * 10; // 10 minutes

export const getBookingById = orpc
  .route({
    method: "GET",
    path: "/bookings/{bookingId}",
    summary: "Fetch a booking by ID",
    description: "Returns booking details given a valid booking ID.",
    tags: [API_TAGS.BOOKINGS],
  })
  .input(GetBookingInput)
  .output(GetBookingOutput)
  .errors({
    NOT_FOUND: { message: "Booking not found" },
  })
  .handler(async ({ input, context, errors }) => {
    const cacheKey = context.cache.getKey.bookingCache(input.bookingId);

    const cached = await context.cache.get<GetBookingResult>(cacheKey);
    if (cached) {
      return cached;
    }

    const db = getDB(context.env.DB);

    const booking = await db.query.bookings.findFirst({
      where: (fields, { eq }) => eq(fields.bookingId, input.bookingId),
    });

    if (!booking) {
      throw errors.NOT_FOUND();
    }

    const result: GetBookingResult = {
      success: true as const,
      booking,
    };

    await context.cache.set(cacheKey, result, BOOKING_CACHE_TTL_SECONDS);

    return result;
  });

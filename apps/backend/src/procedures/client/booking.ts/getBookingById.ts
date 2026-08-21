import { getDB } from "@/db/db";
import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import {
  GetBookingByIdRequestSchema,
  GetBookingByIdResponse,
  GetBookingByIdResponseSchema,
} from "@lobango/contracts/bookings";

export const getBookingById = orpc
  .route({
    method: "GET",
    path: "/bookings/{bookingId}",
    summary: "Fetch a booking by ID",
    description: "Returns booking details given a valid booking ID.",
    tags: [API_TAGS.BOOKINGS],
  })
  .input(GetBookingByIdRequestSchema)
  .output(GetBookingByIdResponseSchema)
  .errors({
    NOT_FOUND: { message: "Booking not found" },
  })
  .handler(async ({ input, context, errors }) => {
    const cacheKey = context.cache.getKey.bookingCache(input.bookingId);

    const cached = await context.cache.get<GetBookingByIdResponse>(cacheKey);
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

    const result: GetBookingByIdResponse = {
      success: true as const,
      booking,
    };

    await context.cache.set(cacheKey, result, context.env.BOOKING_CACHE_TTL);

    return result;
  });

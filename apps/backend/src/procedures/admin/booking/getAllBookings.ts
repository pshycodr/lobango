import { getDB } from "@/db/db";
import { bookings } from "@/db/schema";
import { adminOrpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import {
  GetAllBookings,
  GetAllBookingsRequestSchema,
  GetAllBookingsResponse,
  GetAllBookingsResponseSchema,
} from "@lobango/contracts/bookings";
import { and, desc, gte, lt } from "drizzle-orm";

export const getAllBookings = adminOrpc
  .route({
    method: "GET",
    path: "/admin/bookings",
    tags: [API_TAGS.ADMIN.BOOKING],
    summary: "Get all bookings",
    description: "Returns all bookings ordered by date and time.",
  })
  .input(GetAllBookingsRequestSchema)
  .output(GetAllBookingsResponseSchema)
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: "Unable to fetch bookings. Please try again later.",
    },
  })
  .handler(async ({ input, context, errors }) => {
    try {
      const cacheKeyVersion = await context.cache.get<number>(
        context.cache.getKey.admin.bookingVersion()
      );

      const cacheKey = context.cache.getKey.admin.bookings(
        cacheKeyVersion,
        input
      );

      const cached = await context.cache.get<GetAllBookingsResponse>(cacheKey);

      if (cached) {
        return cached;
      }

      const db = getDB(context.env.DB);

      let whereCondition;

      if (input.date) {
        const targetDate = new Date(input.date);

        const startOfDay = new Date(
          Date.UTC(
            targetDate.getUTCFullYear(),
            targetDate.getUTCMonth(),
            targetDate.getUTCDate()
          )
        );

        const startOfNextDay = new Date(startOfDay);
        startOfNextDay.setUTCDate(startOfNextDay.getUTCDate() + 1);

        whereCondition = and(
          gte(bookings.createdAt, startOfDay.toISOString()),
          lt(bookings.createdAt, startOfNextDay.toISOString())
        );
      } else if (input.from && input.to) {
        const fromDate = new Date(input.from);
        const toDate = new Date(input.to);

        const startOfFrom = new Date(
          Date.UTC(
            fromDate.getUTCFullYear(),
            fromDate.getUTCMonth(),
            fromDate.getUTCDate()
          )
        );

        const startOfTo = new Date(
          Date.UTC(
            toDate.getUTCFullYear(),
            toDate.getUTCMonth(),
            toDate.getUTCDate()
          )
        );

        const startOfNextDay = new Date(startOfTo);
        startOfNextDay.setUTCDate(startOfNextDay.getUTCDate() + 1);

        whereCondition = and(
          gte(bookings.createdAt, startOfFrom.toISOString()),
          lt(bookings.createdAt, startOfNextDay.toISOString())
        );
      }

      const rows = await db
        .select({
          id: bookings.id,
          bookingId: bookings.bookingId,
          customerName: bookings.customerName,
          customerPhone: bookings.customerPhone,
          customerEmail: bookings.customerEmail,
          date: bookings.date,
          time: bookings.time,
          numberOfPeople: bookings.numberOfPeople,
          message: bookings.message,
          status: bookings.status,
          createdAt: bookings.createdAt,
        })
        .from(bookings)
        .where(whereCondition)
        .orderBy(desc(bookings.createdAt))
        .all();

      const result: GetAllBookings[] = rows;

      const response: GetAllBookingsResponse = {
        success: true,
        count: result.length,
        data: result,
      };

      await context.cache.set(
        cacheKey,
        response,
        context.env.BOOKING_CACHE_TTL
      );

      return response;
    } catch {
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

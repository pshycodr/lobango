import { getDB } from "@/db/db";
import { bookings } from "@/db/schema";
import { adminOrpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import {
  UpdateBookingStatusRequestSchema,
  UpdateBookingStatusResponseSchema,
} from "@lobango/contracts/bookings";
import { eq } from "drizzle-orm";

export const updateBookingStatus = adminOrpc
  .route({
    method: "PATCH",
    path: "/admin/bookings/:bookingId",
    tags: [API_TAGS.ADMIN],
    summary: "Update booking status",
    description:
      "Updates the status of a booking and sends an updated booking confirmation email to the customer.",
  })
  .input(UpdateBookingStatusRequestSchema)
  .output(UpdateBookingStatusResponseSchema)
  .errors({
    NOT_FOUND: {
      message: "Booking not found.",
    },
    INTERNAL_SERVER_ERROR: {
      message: "Server error.",
    },
  })
  .handler(async ({ input, context, errors }) => {
    try {
      const db = getDB(context.env.DB);

      const [updatedBooking] = await db
        .update(bookings)
        .set({ status: input.status })
        .where(eq(bookings.bookingId, input.bookingId))
        .returning({
          bookingId: bookings.bookingId,
          customerName: bookings.customerName,
          customerPhone: bookings.customerPhone,
          customerEmail: bookings.customerEmail,
          date: bookings.date,
          time: bookings.time,
          numberOfPeople: bookings.numberOfPeople,
        });

      if (!updatedBooking) {
        throw errors.NOT_FOUND();
      }

      // [TODO]: Use queue to off load this
      // await sendBookingEmail({
      //   env: context.env,
      //   to: updatedBooking.customerEmail,
      //   customer_name: updatedBooking.customerName,
      //   booking_id: updatedBooking.bookingId,
      //   customer_phone: updatedBooking.customerPhone,
      //   customer_email: updatedBooking.customerEmail,
      //   date: updatedBooking.date,
      //   time: updatedBooking.time,
      //   number_of_people: updatedBooking.numberOfPeople,
      // });

      await context.cache.invalidateVersion(
        context.cache.getKey.admin.bookingVersion()
      );

      await context.cache.invalidate(
        context.cache.getKey.bookingCache(input.bookingId)
      );

      return {
        success: true as const,
      };
    } catch (error) {
      if (error instanceof Error && error.message === "Booking not found.") {
        throw error;
      }

      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

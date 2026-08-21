import { getDB } from "@/db/db";
import { bookings } from "@/db/schema";
import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { generateBookingId } from "@/utils/generateId";
import {
  CreateBookingRequestSchema,
  CreateBookingResponseSchema,
} from "@lobango/contracts/bookings";
import { eq } from "drizzle-orm";

export const createBooking = orpc
  .route({
    method: "POST",
    path: "/booking",
    summary: "Add New Booking",
    description: "Create a new table booking",
    tags: [API_TAGS.BOOKINGS],
  })
  .input(CreateBookingRequestSchema)
  .output(CreateBookingResponseSchema)
  .errors({
    CONFLICT: {
      message: "You already have a booking.",
    },
    INTERNAL_SERVER_ERROR: {
      message: "Server error.",
    },
  })
  .handler(async ({ input, context, errors }) => {
    const db = getDB(context.env.DB);
    const createdAt = new Date().toISOString();

    // check for duplicate booking (same phone)
    const existing = await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerPhone, input.customerPhone));

    if (existing.length > 0) {
      throw errors.CONFLICT();
    }

    const bookingId = generateBookingId();

    const result = await db.insert(bookings).values({
      bookingId,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      date: input.date,
      time: input.time,
      numberOfPeople: input.numberOfPeople,
      message: input.message || "N/A",
      createdAt,
    });

    if (result.meta.changes == 0) {
      throw errors.INTERNAL_SERVER_ERROR();
    }

    // [TODO]: Use queue to off load this
    // await sendBookingEmail({
    //   env: context.env,
    //   to: input.customerEmail,
    //   customer_name: input.customerName,
    //   booking_id: bookingId,
    //   customer_phone: input.customerPhone,
    //   customer_email: input.customerEmail,
    //   date: input.date,
    //   time: input.time,
    //   number_of_people: input.numberOfPeople,
    // });

    return {
      success: true as const,
      bookingId,
    };
  });

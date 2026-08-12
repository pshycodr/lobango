import { getDB } from "@/db/db";
import { bookings } from "@/db/schema";
import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { generateBookingId } from "@/utils/generateId";
import { NewBookingSchema } from "@lobango/contracts/bookings";
import { eq } from "drizzle-orm";
import { z } from "zod";

const AddBookingResponseSchema = z.object({
  success: z.literal(true),
  bookingId: z.string(),
});

export const addBooking = orpc
  .route({
    method: "POST",
    path: "/booking",
    summary: "Add New Booking",
    description: "Create a new table booking",
    tags: [API_TAGS.BOOKINGS],
  })
  .input(NewBookingSchema)
  .output(AddBookingResponseSchema)
  .errors({
    CONFLICT: { message: "You already have a booking." },
  })
  .handler(async ({ input, context, errors }) => {
    const db = getDB(context.env.DB);
    const createdAt = new Date().toISOString();

    // check for duplicate booking (same phone)
    const existing = await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerPhone, input.phone));

    if (existing.length > 0) {
      throw errors.CONFLICT();
    }

    const bookingId = generateBookingId();

    await db.insert(bookings).values({
      bookingId,
      customerName: input.name,
      customerPhone: input.phone,
      customerEmail: input.email,
      date: input.date,
      time: input.time,
      numberOfPeople: parseInt(input.person, 10),
      message: input.message || "N/A",
      createdAt,
    });

    return {
      success: true as const,
      bookingId,
    };
  });

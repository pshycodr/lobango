import { BookingSchema } from "@lobango/contracts/bookings";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { customAlphabet } from "nanoid";
import { getDB } from "../../db/db";
import { bookings } from "../../db/schema";

const generateBookingId = () => {
  const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);
  return `BK_${nanoid()}`;
};

const addBooking = async (c: Context) => {
  try {
    const body = await c.req.json();
    const parseResult = BookingSchema.safeParse(body);
    const created_at = new Date().toISOString();

    if (!parseResult.success) {
      return c.json(
        {
          success: false,
          error: "Invalid data",
          issues: parseResult.error.issues,
        },
        400,
      );
    }

    const data = parseResult.data;

    const booking_id = generateBookingId();
    const db = getDB(c.env.DB);

    // check for duplicate booking (same phone + date + time)
    const existing = await db
      .select()
      .from(bookings)
      .where(eq(bookings.customer_phone, data.phone));

    if (existing.length > 0) {
      return c.json(
        { success: false, error: "You already have a booking." },
        409,
      );
    }

    const result = await db.insert(bookings).values({
      booking_id,
      customer_name: data.name,
      customer_phone: data.phone,
      customer_email: data.email,
      date: data.date,
      time: data.time,
      number_of_people: parseInt(data.person, 10),
      message: data.message || "N/A",
      created_at,
    });

    return c.json({ success: true, booking_id }, 201);
  } catch (error) {
    console.error("Booking error:", error);
    return c.json(
      { success: false, error: "Something went wrong. Please try again." },
      500,
    );
  }
};

export default addBooking;

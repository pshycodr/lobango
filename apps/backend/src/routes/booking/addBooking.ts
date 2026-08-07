import { BookingSchema } from "@lobango/contracts/bookings";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { customAlphabet } from "nanoid";
import { getDB } from "../../db/db";
import { bookings } from "../../db/schema";
import { HttpStatus } from "@/constants/httpStatusCodes";

const generateBookingId = () => {
  const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);
  return `BK_${nanoid()}`;
};

const addBooking = async (c: Context) => {
  try {
    const body = await c.req.json();
    const parseResult = BookingSchema.safeParse(body);
    const createdAt = new Date().toISOString();

    if (!parseResult.success) {
      return c.json(
        {
          success: false,
          error: "Invalid data",
          issues: parseResult.error.issues,
        },
        HttpStatus.BadRequest
      );
    }

    const data = parseResult.data;

    const bookingId = generateBookingId();
    const db = getDB(c.env.DB);

    // check for duplicate booking (same phone + date + time)
    const existing = await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerPhone, data.phone));

    if (existing.length > 0) {
      return c.json(
        { success: false, error: "You already have a booking." },
        HttpStatus.Conflict
      );
    }

    const result = await db.insert(bookings).values({
      bookingId: bookingId,
      customerName: data.name,
      customerPhone: data.phone,
      customerEmail: data.email,
      date: data.date,
      time: data.time,
      numberOfPeople: parseInt(data.person, 10),
      message: data.message || "N/A",
      createdAt: createdAt,
    });

    return c.json({ success: true, bookingId }, HttpStatus.Created);
  } catch (error) {
    console.error("Booking error:", error);
    return c.json(
      { success: false, error: "Something went wrong. Please try again." },
      HttpStatus.InternalServerError
    );
  }
};

export default addBooking;

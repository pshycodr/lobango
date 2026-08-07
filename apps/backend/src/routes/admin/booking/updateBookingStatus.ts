import { UpdateBookingSchema } from "@lobango/contracts/admin";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { getDB } from "../../../db/db";
import { bookings } from "../../../db/schema";
import { sendBookingEmail } from "../../../utils/sendEmail";
import { HttpStatus } from "@/constants/httpStatusCodes";

const updateBookingStatus = async (c: Context) => {
  try {
    const body = await c.req.json();
    const parsed = UpdateBookingSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        { success: false, error: "Invalid data." },
        HttpStatus.BadRequest
      );
    }

    const { booking_id, status } = parsed.data;
    const db = getDB(c.env.DB);

    const result = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.bookingId, booking_id))
      .run();

    if (result.meta.changes === 0) {
      return c.json(
        { success: false, error: "Booking not found." },
        HttpStatus.NotFound
      );
    }

    // Fetch updated booking
    const updatedBooking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.bookingId, booking_id))
      .get();

    if (!updatedBooking) {
      return c.json(
        { success: false, error: "Booking not found after update." },
        HttpStatus.NotFound
      );
    }

    await sendBookingEmail({
      env: c.env,
      to: updatedBooking.customerEmail,
      customer_name: updatedBooking.customerName,
      booking_id: updatedBooking.bookingId,
      customer_phone: updatedBooking.customerPhone,
      customer_email: updatedBooking.customerEmail,
      date: updatedBooking.date,
      time: updatedBooking.time,
      number_of_people: updatedBooking.numberOfPeople,
    });

    return c.json(
      {
        success: true,
      },
      HttpStatus.Ok
    );
  } catch (error) {
    console.error("Booking status update failed:", error);
    return c.json(
      { success: false, error: "Server error." },
      HttpStatus.InternalServerError
    );
  }
};

export default updateBookingStatus;

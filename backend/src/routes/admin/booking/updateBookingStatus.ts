import { Context } from "hono";
import { eq } from "drizzle-orm";
import z from "zod";
import { getDB } from "../../../db/db";
import { bookings } from "../../../db/schema";
import { sendBookingEmail } from "../../../utils/sendEmail";

const UpdateBookingSchema = z.object({
  booking_id: z.string(),
  status: z.enum(["pending", "accepted", "rejected"]),
});

const updateBookingStatus = async (c: Context) => {
  try {
    const body = await c.req.json();
    const parsed = UpdateBookingSchema.safeParse(body);
    
    if (!parsed.success) {
      return c.json({ success: false, error: "Invalid data." }, 400);
    }

    const { booking_id, status } = parsed.data;
    const db = getDB(c.env.DB);

    const result = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.booking_id, booking_id))
      .run();

    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "Booking not found." }, 404);
    }

    // Fetch updated booking
    const updatedBooking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.booking_id, booking_id))
      .get();

    if (!updatedBooking) {
      return c.json({ success: false, error: "Booking not found after update." }, 404);
    }

    await sendBookingEmail({
      env: c.env,
      to: updatedBooking.customer_email,
      customer_name: updatedBooking.customer_name,
      booking_id: updatedBooking.booking_id,
      customer_phone: updatedBooking.customer_phone,
      customer_email: updatedBooking.customer_email,
      date: updatedBooking.date,
      time: updatedBooking.time,
      number_of_people: updatedBooking.number_of_people
    });

    return c.json({
      success: true,
    });
  } catch (error) {
    console.error("Booking status update failed:", error);
    return c.json({ success: false, error: "Server error." }, 500);
  }
};

export default updateBookingStatus;
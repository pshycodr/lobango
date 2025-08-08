import { Context } from "hono";
import { getDB } from "../../db/db";
import { bookings } from "../../db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

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

    return c.json({
      success: true,
      updated: result.rowsAffected ?? 0,
      message: result.rowsAffected ? "Status updated." : "Booking not found.",
    });
  } catch (error) {
    console.error("Booking status update failed:", error);
    return c.json({ success: false, error: "Server error." }, 500);
  }
};

export default updateBookingStatus;

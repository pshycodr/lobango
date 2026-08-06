import { Context } from "hono";
import { getDB } from "../../../db/db";
import { bookings } from "../../../db/schema";
import { HttpStatus } from "@/constants/httpStatusCodes";

const viewBookings = async (c: Context) => {
  try {
    const db = getDB(c.env.DB);

    const allBookings = await db
      .select()
      .from(bookings)
      .orderBy(bookings.date, bookings.time)
      .all();

    return c.json({
      success: true,
      count: allBookings.length,
      data: allBookings,
    });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return c.json(
      {
        success: false,
        error: "Unable to fetch bookings. Please try again later.",
      },
      HttpStatus.InternalServerError
    );
  }
};

export default viewBookings;

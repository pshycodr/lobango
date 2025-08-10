import { Context } from "hono";
import { getDB } from "../../db/db";
import { permissions } from "../../db/schema/permissions";
import { eq } from "drizzle-orm";
import { z } from "zod";

const bodySchema = z.object({
  value: z.boolean(),
});

export const setNewBookingPermission = async (c: Context) => {
  try {
    const db = getDB(c.env.DB);

    const body = await c.req.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Invalid request body" }, 400);
    }

    await db
      .update(permissions)
      .set({ new_bookings: parsed.data.value })
      .where(eq(permissions.id, 1));

    return c.json({ new_bookings: parsed.data.value });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to update permission" }, 500);
  }
};

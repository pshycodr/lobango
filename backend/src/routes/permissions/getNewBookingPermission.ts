import { Context } from "hono";
import { getDB } from "../../db/db";
import { permissions } from "../../db/schema/permissions";
import { eq } from "drizzle-orm";

export const getNewBookingPermission = async (c: Context) => {
    try {
        const db = getDB(c.env.DB);
        const res = await db
            .select({ new_bookings: permissions.new_bookings })
            .from(permissions)
            .where(eq(permissions.id, 1));

        if (res.length === 0) {
            return c.json({ error: "Permission row not found" }, 404);
        }

        return c.json(Boolean(res[0].new_bookings));
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to fetch permission" }, 500);
    }
};

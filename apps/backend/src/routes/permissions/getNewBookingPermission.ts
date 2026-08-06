import type { AppContext } from "@/types/hono";
import { PERMISSIONS } from "@/types/kvKeys";
import { GetNewBookingPermissionResponse } from "@lobango/contracts";

export const getNewBookingPermission = async (c: AppContext) => {
  try {
    const value = await c.env.KV.get(PERMISSIONS.NEW_BOOKINGS);

    if (value === null) {
      return c.json({ error: "Permission not found" }, 404);
    }

    const response: GetNewBookingPermissionResponse = {
      new_bookings: value === "true",
    };

    return c.json(response, 200);
  } catch (error) {
    console.error(error);

    return c.json({ error: "Failed to fetch permission" }, 500);
  }
};

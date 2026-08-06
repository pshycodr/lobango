import { AppContext } from "@/types/hono";
import { PERMISSIONS } from "@/types/kvKeys";
import type { SetNewBookingPermissionResponse } from "@lobango/contracts/permissions";
import { z } from "zod";

const bodySchema = z.object({
  value: z.boolean(),
});

export const setNewBookingPermission = async (c: AppContext) => {
  try {
    const body = await c.req.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Invalid request body" }, 400);
    }

    await c.env.KV.put(PERMISSIONS.NEW_BOOKINGS, String(parsed.data.value));

    const response: SetNewBookingPermissionResponse = {
      new_bookings: parsed.data.value,
    };

    return c.json(response, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to update permission" }, 500);
  }
};

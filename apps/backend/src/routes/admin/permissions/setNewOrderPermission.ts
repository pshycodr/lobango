import { AppContext } from "@/types/hono";
import { PERMISSIONS } from "@/types/kvKeys";
import type { SetNewOrderPermissionResponse } from "@lobango/contracts/permissions";
import { z } from "zod";

const bodySchema = z.object({
  value: z.boolean(), // must be true or false
});

export const setNewOrderPermission = async (c: AppContext) => {
  try {
    const body = await c.req.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Invalid request body" }, 400);
    }

    await c.env.KV.put(PERMISSIONS.NEW_ORDERS, String(parsed.data.value));

    const response: SetNewOrderPermissionResponse = {
      new_orders: parsed.data.value,
    };

    return c.json(response, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to update permission" }, 500);
  }
};

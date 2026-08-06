import { HttpStatus } from "@/constants/httpStatusCodes";
import { AppContext } from "@/types/hono";
import { PERMISSIONS } from "@/types/kvKeys";
import { GetNewOrderPermissionResponse } from "@lobango/contracts/permissions";

export const getNewOrderPermission = async (c: AppContext) => {
  try {
    const value = await c.env.KV.get(PERMISSIONS.NEW_ORDERS);

    if (value === null) {
      return c.json({ error: "Permission not found" }, HttpStatus.NotFound);
    }

    const response: GetNewOrderPermissionResponse = {
      new_orders: value === "true",
    };

    return c.json(response, HttpStatus.Ok);
  } catch (error) {
    console.error(error);

    return c.json(
      { error: "Failed to fetch permission" },
      HttpStatus.InternalServerError
    );
  }
};

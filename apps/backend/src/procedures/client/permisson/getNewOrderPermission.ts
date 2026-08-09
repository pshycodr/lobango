import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { PERMISSIONS } from "@/types/kvKeys";
import { ORPCError } from "@orpc/server";
import * as z from "zod";

const GetNewOrderPermissionOutput = z.object({
  new_orders: z.boolean(),
});

export const getNewOrderPermission = orpc
  .route({
    method: "GET",
    path: "/permission/new-order",
    tags: [API_TAGS.PERMISSIONS],
    summary: "Check if new orders are enabled",
    description:
      "This is used to flag the availability of the order service in frontend",
  })
  .output(GetNewOrderPermissionOutput)
  .handler(async ({ context }) => {
    const value = await context.env.KV.get(PERMISSIONS.NEW_ORDERS);

    if (value === null) {
      throw new ORPCError("NOT_FOUND", { message: "Permission not found" });
    }

    return { new_orders: value === "true" };
  });

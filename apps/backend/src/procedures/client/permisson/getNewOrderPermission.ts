import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { GetOrderPermissionResponseSchema } from "@lobango/contracts/permissions/order";
import { ORPCError } from "@orpc/server";

export const getNewOrderPermission = orpc
  .route({
    method: "GET",
    path: "/permission/new-order",
    tags: [API_TAGS.CLIENT.PERMISSION],
    summary: "Check if new orders are enabled",
    description:
      "This is used to flag the availability of the order service in frontend",
  })
  .output(GetOrderPermissionResponseSchema)
  .handler(async ({ context }) => {
    const cacheKey = context.cache.getKey.orderPermission();
    const value = await context.env.KV.get(cacheKey);

    if (value === null) {
      throw new ORPCError("NOT_FOUND", { message: "Permission not found" });
    }

    return { success: true as const, newOrder: value === "true" };
  });

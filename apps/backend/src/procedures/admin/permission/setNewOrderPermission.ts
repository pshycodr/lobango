import { adminOrpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import {
  SetOrderPermissionRequestSchema,
  SetOrderPermissionResponseSchema,
} from "@lobango/contracts/permissions/order";

export const setNewOrderPermission = adminOrpc
  .route({
    method: "POST",
    path: "/permission/new-order",
    tags: [API_TAGS.ADMIN.PERMISSION],
    summary: "Set/Update the new Order permission",
    description:
      "This is used to flag the availability of the Order service in frontend",
  })
  .input(SetOrderPermissionRequestSchema)
  .output(SetOrderPermissionResponseSchema)
  .errors({
    NOT_FOUND: {
      message: "Permission not found",
    },
  })
  .handler(async ({ context, input }) => {
    const cacheKey = context.cache.getKey.orderPermission();
    await context.cache.set(cacheKey, input.newOrder.toString());
    return { success: true, newOrder: input.newOrder };
  });

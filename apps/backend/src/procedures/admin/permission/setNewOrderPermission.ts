import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { z } from "zod";

const SetNewOrderPermissionInput = z.object({
  new_orders: z.boolean(),
});

const SetNewOrderPermissionOutput = z.object({
  success: z.boolean(),
  new_orders: z.boolean(),
});

export const setNewOrderPermission = orpc
  .route({
    method: "POST",
    path: "/permission/new-order",
    tags: [API_TAGS.ADMIN, API_TAGS.PERMISSIONS],
    summary: "Set/Update the new Order permission",
    description:
      "This is used to flag the availability of the Order service in frontend",
  })
  .input(SetNewOrderPermissionInput)
  .output(SetNewOrderPermissionOutput)
  .errors({
    NOT_FOUND: {
      message: "Permission not found",
    },
  })
  .handler(async ({ context, input }) => {
    const cacheKey = context.cache.getKey.orderPermission();
    await context.cache.set(cacheKey, input.new_orders.toString());
    return { success: true, new_orders: input.new_orders };
  });

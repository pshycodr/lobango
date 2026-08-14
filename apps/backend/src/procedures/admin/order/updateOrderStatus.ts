import { getDB } from "@/db/db";
import { orders } from "@/db/schema";
import { adminOrpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import {
  UpdateOrderStatusRequestSchema,
  UpdateOrderStatusResponseSchema,
} from "@lobango/contracts/order";
import { eq } from "drizzle-orm";

export const updateOrderStatus = adminOrpc
  .route({
    method: "PATCH",
    path: "/admin/orders/{orderId}/status",
    tags: [API_TAGS.ADMIN],
    summary: "Update order status",
    description: "Updates the status of an order.",
  })
  .input(UpdateOrderStatusRequestSchema)
  .output(UpdateOrderStatusResponseSchema)
  .errors({
    NOT_FOUND: { message: "Order not found" },
  })
  .handler(async ({ input, context, errors }) => {
    const db = getDB(context.env.DB);

    const result = await db
      .update(orders)
      .set({ status: input.status })
      .where(eq(orders.orderId, input.orderId))
      .run();

    if ((result.meta?.changes ?? 0) === 0) {
      throw errors.NOT_FOUND();
    }

    await context.cache.invalidateVersion(
      context.cache.getKey.admin.ordersVersion()
    );

    return {
      success: true as const,
      updated: result.meta?.changes ?? 0,
      status: input.status,
    };
  });

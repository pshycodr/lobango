import { getDB } from "@/db/db";
import { orders } from "@/db/schema";
import { adminOrpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { orderStatusValues } from "@lobango/contracts/enums";
import { OrderStatusUpdateSchema } from "@lobango/contracts/admin";
import { eq } from "drizzle-orm";
import { z } from "zod";

const UpdateOrderStatusOutput = z.object({
  success: z.literal(true),
  updated: z.number(),
  status: z.enum(orderStatusValues),
});

export const updateOrderStatus = adminOrpc
  .route({
    method: "PATCH",
    path: "/admin/orders/{orderId}/status",
    tags: [API_TAGS.ADMIN],
    summary: "Update order status",
    description: "Updates the status of an order.",
  })
  .input(OrderStatusUpdateSchema)
  .output(UpdateOrderStatusOutput)
  .handler(async ({ input, context }) => {
    const db = getDB(context.env.DB);

    const result = await db
      .update(orders)
      .set({ status: input.status })
      .where(eq(orders.orderId, input.orderId))
      .run();

    return {
      success: true as const,
      updated: result.meta?.changes ?? 0,
      status: input.status,
    };
  });

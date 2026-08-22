import { getDB } from "@/db/db";
import { orders } from "@/db/schema";
import { adminOrpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import {
  UpdateOrderStatusRequestSchema,
  UpdateOrderStatusResponseSchema,
} from "@lobango/contracts/order";
import { isEmailWorthyOrderStatus } from "@/types/email";
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

    const [updatedOrder] = await db
      .update(orders)
      .set({ status: input.status })
      .where(eq(orders.orderId, input.orderId))
      .returning({
        orderId: orders.orderId,
        customerName: orders.customerName,
        customerEmail: orders.customerEmail,
      });

    if (!updatedOrder) {
      throw errors.NOT_FOUND();
    }

    await context.cache.invalidateVersion(
      context.cache.getKey.admin.ordersVersion()
    );

    await context.cache.invalidate(
      context.cache.getKey.orderCache(input.orderId)
    );

    if (updatedOrder.customerEmail && isEmailWorthyOrderStatus(input.status)) {
      await context.queues.EmailQueue.send({
        type: "order-status-update",
        to: updatedOrder.customerEmail,
        name: updatedOrder.customerName,
        orderId: updatedOrder.orderId,
        status: input.status,
      });
    }

    return {
      success: true as const,
      updated: 1,
      status: input.status,
    };
  });

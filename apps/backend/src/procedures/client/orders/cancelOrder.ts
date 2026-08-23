import { getDB } from "@/db/db";
import { orders } from "@/db/schema";
import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import type { OtpActionData } from "@/procedures/shared/otp/verifyOtp";
import {
  CancelOrderRequestSchema,
  CancelOrderResponseSchema,
} from "@lobango/contracts/order";
import { eq } from "drizzle-orm";

export const cancelOrder = orpc
  .route({
    method: "POST",
    path: "/order/cancel",
    summary: "Cancel Order",
    description:
      "Cancels an existing order after verifying the one-time action token.",
    tags: [API_TAGS.CLIENT.ORDER],
  })
  .input(CancelOrderRequestSchema)
  .output(CancelOrderResponseSchema)
  .errors({
    UNAUTHORIZED: {
      message: "Unauthorized or invalid cancellation token",
    },
    NOT_FOUND: {
      message: "Order not found",
    },
    BAD_REQUEST: {
      message: "This order cannot be cancelled in its current state",
    },
    INTERNAL_SERVER_ERROR: {
      message: "Failed to cancel order",
    },
  })
  .handler(async ({ input, context, errors }) => {
    const tokenKey = context.cache.getKey.otpActionKey(input.actionToken);
    const tokenData = await context.cache.get<OtpActionData>(tokenKey);

    if (
      !tokenData ||
      tokenData.purpose !== "cancel_order" ||
      tokenData.resourceId !== input.orderId
    ) {
      throw errors.UNAUTHORIZED();
    }

    // Consume the one-time action token
    await context.cache.delete(tokenKey);

    const db = getDB(context.env.DB);

    const [existingOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderId, input.orderId));

    if (!existingOrder) {
      throw errors.NOT_FOUND();
    }

    if (
      existingOrder.customerEmail.toLowerCase() !==
      tokenData.email.toLowerCase()
    ) {
      throw errors.UNAUTHORIZED();
    }

    if (
      existingOrder.status !== "pending" &&
      existingOrder.status !== "accepted"
    ) {
      throw errors.BAD_REQUEST({
        message: `Order cannot be cancelled because it is already ${existingOrder.status.replace(/_/g, " ")}`,
      });
    }

    const [updatedOrder] = await db
      .update(orders)
      .set({ status: "canceld" })
      .where(eq(orders.orderId, input.orderId))
      .returning({
        orderId: orders.orderId,
        customerName: orders.customerName,
        customerEmail: orders.customerEmail,
      });

    if (!updatedOrder) {
      throw errors.INTERNAL_SERVER_ERROR();
    }

    await context.cache.invalidateVersion(
      context.cache.getKey.admin.ordersVersion()
    );

    await context.cache.invalidate(
      context.cache.getKey.orderCache(input.orderId)
    );

    if (updatedOrder.customerEmail) {
      await context.env.EMAIL_QUEUE.send({
        type: "order-status-update",
        to: updatedOrder.customerEmail,
        name: updatedOrder.customerName,
        orderId: updatedOrder.orderId,
        status: "canceld",
        reason: "Order cancelled by customer",
      });
    }

    return {
      success: true,
      orderId: input.orderId,
      message: "Order cancelled successfully",
    };
  });

export const cancleOrder = cancelOrder;

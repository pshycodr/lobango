import { OrderStatusUpdateSchema } from "@lobango/contracts/admin";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { getDB } from "../../../db/db";
import { orders } from "../../../db/schema";
import { HttpStatus } from "@/constants/httpStatusCodes";

export const updateOrderStatus = async (c: Context) => {
  try {
    const body: unknown = await c.req.json();
    const parsed = OrderStatusUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        { success: false, message: "Invalid request body" },
        HttpStatus.BadRequest
      );
    }

    const { orderId, status } = parsed.data;
    const db = getDB(c.env.DB);

    const res = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.order_id, orderId));

    return c.json(
      { success: true, updated: res.meta.changes ?? 0, status },
      HttpStatus.Ok
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return c.json(
      { success: false, message: "Internal Server Error" },
      HttpStatus.InternalServerError
    );
  }
};

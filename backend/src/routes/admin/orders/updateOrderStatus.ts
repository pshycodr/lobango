import { Context } from "hono";
import z from "zod";
import { getDB } from "../../../db/db";
import { orders } from "../../../db/schema";
import { eq } from "drizzle-orm";

const OrderStatusUpdateProps = z.object({
    orderId: z.string(),
    status: z.enum(["pending", "accepted", "out for delivery", "delivered", "rejected"]),
});

type OrderStatusUpdate = z.infer<typeof OrderStatusUpdateProps>;

export const updateOrderStatus = async (c: Context) => {
    try {
        const body: unknown = await c.req.json();
        const parsed = OrderStatusUpdateProps.safeParse(body);

        if (!parsed.success) {
            return c.json({ success: false, message: "Invalid request body" }, 400);
        }

        const { orderId, status } = parsed.data;
        const db = getDB(c.env.DB);

        const res = await db
            .update(orders)
            .set({ status })
            .where(eq(orders.order_id, orderId));

        return c.json({ success: true, updated: res.rowsAffected ?? 0, status });
    } catch (error) {
        console.error("Error updating order status:", error);
        return c.json({ success: false, message: "Internal Server Error" }, 500);
    }
};


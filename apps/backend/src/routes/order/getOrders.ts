import { Context } from "hono";
import z from "zod";
import { getDB } from "../../db/db";
import { orders, orderItems } from "../../db/schema";
import { eq } from "drizzle-orm";

const GetOrdersSchema = z.object({
  order_id: z.string().trim(),
});

type GetOrder = z.infer<typeof GetOrdersSchema>;

export async function getOrders(c: Context) {
  try {
    const body = await c.req.json();
    const parsedBody = GetOrdersSchema.safeParse(body);

    if (!parsedBody.success) {
      return c.json({ error: parsedBody.error.flatten() }, 400);
    }

    const data: GetOrder = parsedBody.data;
    const db = getDB(c.env.DB);

    // Perform LEFT JOIN between orders and orderItems
    const joined = await db
      .select({
        order: orders,
        item: orderItems,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.order_id, orderItems.order_id))
      .where(eq(orders.order_id, data.order_id));

    if (joined.length === 0) {
      return c.json({ error: "Order not found" }, 404);
    }

    const { order } = joined[0];

    const items = joined
      .filter(
        (
          j,
        ): j is {
          order: typeof orders.$inferSelect;
          item: typeof orderItems.$inferSelect;
        } => j.item !== null,
      )
      .map((j) => ({
        name: j.item.name,
        price: j.item.price,
        quantity: j.item.quantity,
      }));

    return c.json({
      success: true,
      order: {
        orderId: order.order_id,
        name: order.customer_name,
        phone: order.customer_phone,
        address: order.customer_address,
        total: order.total_amount,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        status: order.status,
        createdAt: order.created_at,
      },
      items,
    });
  } catch (error: any) {
    console.error("Order lookup failed", {
      error,
      timestamp: new Date().toISOString(),
    });
    return c.json({ error: "Internal Server Error" }, 500);
  }
}

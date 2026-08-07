import { Context } from "hono";
import z from "zod";
import { getDB } from "@/db/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HttpStatus } from "@/constants/httpStatusCodes";

const GetOrdersSchema = z.object({
  order_id: z.string().trim(),
});

type GetOrder = z.infer<typeof GetOrdersSchema>;

export async function getOrders(c: Context) {
  try {
    const body = await c.req.json();
    const parsedBody = GetOrdersSchema.safeParse(body);

    if (!parsedBody.success) {
      return c.json(
        { error: parsedBody.error.flatten() },
        HttpStatus.BadRequest
      );
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
      .leftJoin(orderItems, eq(orders.orderId, orderItems.orderId))
      .where(eq(orders.orderId, data.order_id));

    if (joined.length === 0) {
      return c.json({ error: "Order not found" }, HttpStatus.NotFound);
    }

    const { order } = joined[0];

    const items = joined
      .filter(
        (
          j
        ): j is {
          order: typeof orders.$inferSelect;
          item: typeof orderItems.$inferSelect;
        } => j.item !== null
      )
      .map((j) => ({
        name: j.item.name,
        price: j.item.price,
        quantity: j.item.quantity,
      }));

    return c.json(
      {
        success: true,
        order: {
          orderId: order.orderId,
          name: order.customerName,
          phone: order.customerPhone,
          address: order.customerAddress,
          total: order.totalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          createdAt: order.createdAt,
        },
        items,
      },
      HttpStatus.Ok
    );
  } catch (error: any) {
    console.error("Order lookup failed", {
      error,
      timestamp: new Date().toISOString(),
    });
    return c.json(
      { error: "Internal Server Error" },
      HttpStatus.InternalServerError
    );
  }
}

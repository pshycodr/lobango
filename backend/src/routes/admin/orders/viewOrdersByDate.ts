import { Context } from "hono";
import { getDB } from "../../../db/db";
import { orders, orderItems } from "../../../db/schema";
import { eq, desc, and, gte, lt } from "drizzle-orm";
import { z } from "zod";

// Schema for query params
const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function viewOrdersByDate(c: Context) {
  try {
    const db = getDB(c.env.DB);

    // validate query params
    const parseResult = querySchema.safeParse(c.req.query());
    if (!parseResult.success) {
      return c.json(
        {
          success: false,
          error: "Invalid query params",
          issues: parseResult.error.format(),
        },
        400
      );
    }

    const { date, from, to } = parseResult.data;

    let whereCondition;

    if (date) {
      // single date filter (UTC-safe)
      const targetDate = new Date(date);
      const startOfDay = new Date(
        Date.UTC(
          targetDate.getUTCFullYear(),
          targetDate.getUTCMonth(),
          targetDate.getUTCDate()
        )
      );
      const startOfNextDay = new Date(startOfDay);
      startOfNextDay.setUTCDate(startOfNextDay.getUTCDate() + 1);

      whereCondition = and(
        gte(orders.created_at, startOfDay.toISOString()),
        lt(orders.created_at, startOfNextDay.toISOString())
      );
    } else if (from && to) {
      // range filter (UTC-safe)
      const fromDate = new Date(from);
      const toDate = new Date(to);

      const startOfFrom = new Date(
        Date.UTC(
          fromDate.getUTCFullYear(),
          fromDate.getUTCMonth(),
          fromDate.getUTCDate()
        )
      );
      const startOfTo = new Date(
        Date.UTC(
          toDate.getUTCFullYear(),
          toDate.getUTCMonth(),
          toDate.getUTCDate()
        )
      );
      const startOfNextDay = new Date(startOfTo);
      startOfNextDay.setUTCDate(startOfNextDay.getUTCDate() + 1);

      whereCondition = and(
        gte(orders.created_at, startOfFrom.toISOString()),
        lt(orders.created_at, startOfNextDay.toISOString())
      );
    }

    const joined = await db
      .select({
        order: orders,
        item: orderItems,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.order_id, orderItems.order_id))
      .where(whereCondition) // if undefined => all orders
      .orderBy(desc(orders.created_at));

    const ordersMap = new Map<
      string,
      {
        order: typeof orders.$inferSelect;
        items: { name: string; price: string; quantity: string }[];
      }
    >();

    for (const row of joined) {
      const orderId = row.order.order_id;
      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          order: row.order,
          items: [],
        });
      }
      if (row.item) {
        ordersMap.get(orderId)!.items.push({
          name: row.item.name,
          price: row.item.price,
          quantity: row.item.quantity || "0",
        });
      }
    }

    const result = Array.from(ordersMap.values()).map(({ order, items }) => ({
      orderId: order.order_id,
      name: order.customer_name,
      phone: order.customer_phone,
      address: order.customer_address,
      longitude: order.longitude,
      latitude: order.latitude,
      total: order.total_amount,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      status: order.status,
      createdAt: order.created_at,
      items,
    }));

    return c.json({
      success: true,
      count: result.length,
      orders: result,
    });
  } catch (error: any) {
    console.error("Fetch orders failed", {
      error,
      timestamp: new Date().toISOString(),
    });
    return c.json({ error: "Internal Server Error" }, 500);
  }
}

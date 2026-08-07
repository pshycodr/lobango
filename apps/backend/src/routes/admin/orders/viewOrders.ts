import { HttpStatus } from "@/constants/httpStatusCodes";
import { and, desc, eq, gte, lt } from "drizzle-orm";
import { Context } from "hono";
import { z } from "zod";
import { getDB } from "../../../db/db";
import { orderItems, orders } from "../../../db/schema";

// Schema for query params
const querySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export async function viewOrders(c: Context) {
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
        HttpStatus.BadRequest
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
        gte(orders.createdAt, startOfDay.toISOString()),
        lt(orders.createdAt, startOfNextDay.toISOString())
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
        gte(orders.createdAt, startOfFrom.toISOString()),
        lt(orders.createdAt, startOfNextDay.toISOString())
      );
    }

    const joined = await db
      .select({
        order: orders,
        item: orderItems,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.orderId, orderItems.orderId))
      .where(whereCondition) // if undefined => all orders
      .orderBy(desc(orders.createdAt));

    const ordersMap = new Map<
      string,
      {
        order: typeof orders.$inferSelect;
        items: { name: string; price: string; quantity: string }[];
      }
    >();

    for (const row of joined) {
      const orderId = row.order.orderId;
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
      orderId: order.orderId,
      name: order.customerName,
      phone: order.customerPhone,
      address: order.customerAddress,
      longitude: order.longitude,
      latitude: order.latitude,
      total: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      createdAt: order.createdAt,
      items,
    }));

    return c.json(
      {
        success: true,
        count: result.length,
        orders: result,
      },
      HttpStatus.Ok
    );
  } catch (error: any) {
    console.error("Fetch orders failed", {
      error,
      timestamp: new Date().toISOString(),
    });
    return c.json(
      { error: "Internal Server Error" },
      HttpStatus.InternalServerError
    );
  }
}

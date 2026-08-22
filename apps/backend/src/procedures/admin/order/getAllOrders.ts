import { getDB } from "@/db/db";
import { orders } from "@/db/schema";
import { adminOrpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import {
  GetAllOrder,
  GetAllOrdersRequestSchema,
  GetAllOrdersResponse,
  GetAllOrdersResponseSchema,
} from "@lobango/contracts/order";
import { and, desc, gte, lt } from "drizzle-orm";

export const getAllOrders = adminOrpc
  .route({
    method: "GET",
    path: "/admin/orders",
    tags: [API_TAGS.ADMIN.ORDER],
    summary: "View orders",
    description:
      "Returns order summaries. Orders can be filtered by a specific date or a UTC date range.",
  })
  .input(GetAllOrdersRequestSchema)
  .output(GetAllOrdersResponseSchema)
  .handler(async ({ input, context }) => {
    const cacheKeyVersion = await context.cache.get<number>(
      context.cache.getKey.admin.ordersVersion()
    );
    const cacheKey = context.cache.getKey.admin.orders(cacheKeyVersion, input);
    const cached = await context.cache.get<GetAllOrdersResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    const db = getDB(context.env.DB);

    let whereCondition;

    if (input.date) {
      const targetDate = new Date(input.date);

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
    } else if (input.from && input.to) {
      const fromDate = new Date(input.from);
      const toDate = new Date(input.to);

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

    const rows = await db
      .select({
        orderId: orders.orderId,
        customerName: orders.customerName,
        customerPhone: orders.customerPhone,
        totalAmount: orders.totalAmount,
        paymentMethod: orders.paymentMethod,
        paymentStatus: orders.paymentStatus,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(whereCondition)
      .orderBy(desc(orders.createdAt));

    const result: GetAllOrder[] = rows;

    const response = {
      success: true as const,
      count: result.length,
      orders: result,
    };

    await context.cache.set(
      cacheKey,
      response,
      context.env.ADMIN_ORDERS_CACHE_TTL
    );

    return response;
  });

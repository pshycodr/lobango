import { getDB } from "@/db/db";
import {
  orderItems,
  orderItemSelectSchema,
  orders,
  OrdersSelectSchema,
} from "@/db/schema";
import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { eq } from "drizzle-orm";
import { z } from "zod";

const GetOrdersInput = z.object({
  orderId: z.string().trim(),
});

const OrderItemResponseSchema = orderItemSelectSchema.pick({
  name: true,
  price: true,
  quantity: true,
});

const GetOrdersOutput = z.object({
  success: z.literal(true),
  order: OrdersSelectSchema,
  items: z.array(OrderItemResponseSchema),
});

type GetOrdersResult = z.infer<typeof GetOrdersOutput>;

export const getOrdersbById = orpc
  .route({
    method: "GET",
    path: "/orders/{orderId}",
    summary: "Fetch an order by ID",
    description:
      "Returns order details along with the items in that order, given a valid order ID.",
    tags: [API_TAGS.ORDERS],
  })
  .input(GetOrdersInput)
  .output(GetOrdersOutput)
  .errors({
    NOT_FOUND: { message: "Order not found" },
  })
  .handler(async ({ input, context, errors }) => {
    const cacheKey = context.cache.getKey.orderCache(input.orderId);

    const cached = await context.cache.get<GetOrdersResult>(cacheKey);
    if (cached) {
      return cached;
    }

    const db = getDB(context.env.DB);

    const joined = await db
      .select({ order: orders, item: orderItems })
      .from(orders)
      .leftJoin(orderItems, eq(orders.orderId, orderItems.orderId))
      .where(eq(orders.orderId, input.orderId));

    if (joined.length === 0) {
      throw errors.NOT_FOUND();
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

    const result: GetOrdersResult = {
      success: true as const,
      order,
      items,
    };

    // Cache the response
    await context.cache.set(cacheKey, result, context.env.ORDER_CACHE_TTL);

    return result;
  });

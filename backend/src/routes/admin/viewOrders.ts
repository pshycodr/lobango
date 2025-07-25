import { Context } from "hono";
import { getDB } from "../../db/db";
import { orders, orderItems } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function viewOrders(c: Context) {
    try {
        const db = getDB(c.env.DB);

        // LEFT JOIN orders with orderItems
        const joined = await db
            .select({
                order: orders,
                item: orderItems,
            })
            .from(orders)
            .leftJoin(orderItems, eq(orders.order_id, orderItems.order_id));

        // Group by order_id
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
                    quantity: row.item.quantity || '0',
                });
            }
        }

        const result = Array.from(ordersMap.values()).map(({ order, items }) => ({
            orderId: order.order_id,
            name: order.customer_name,
            phone: order.customer_phone,
            address: order.customer_address,
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
        console.error("Fetch all orders failed", {
            error,
            timestamp: new Date().toISOString(),
        });
        return c.json({ error: "Internal Server Error" }, 500);
    }
}

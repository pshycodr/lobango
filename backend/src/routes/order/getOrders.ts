import { Context } from "hono";
import z, { success } from "zod"
import { getDB } from "../../db/db";
import { orderItems, orders } from "../../db/schema";
import { eq } from "drizzle-orm";

const GetOrdersSchema = z.object({
    ph_no: z.string(),
    order_id: z.string()
})

type GetOrder = z.infer<typeof GetOrdersSchema>;


export async function getOrders(c: Context) {
    try {
        const body = await c.req.json()

        const parsedBody = GetOrdersSchema.safeParse(body)

        if (!parsedBody.success) {
            return c.json({ error: parsedBody.error.message }, 400);
        }

        const data: GetOrder = parsedBody.data; 
        const db = getDB(c.env.DB)

        const order = await db.query.orders.findMany({
            where: eq(orders.order_id, data.order_id),
        })  

        const order_items = await db.query.orderItems.findMany({
            where : eq(orderItems.order_id, data.order_id)
        })

        return c.json({
            success: true,
            order,
            orderItems:  order_items
        })
    } catch (error: any) {
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }


}
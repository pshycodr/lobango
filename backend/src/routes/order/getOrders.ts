import { Context } from "hono";
import z, { success } from "zod"

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
        const db = c.env.DB

        const res = await db.prepare(`
            SELECT * FROM orders WHERE customer_phone = ? AND order_id = ?
          `).bind(data.ph_no, data.order_id).all();

        return c.json({
            success: true,
            orders: res
        })
    } catch (error: any) {
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }


}
import { Context } from "hono"
import z from "zod"
import { getDB } from "../../db/db"
import { orders } from "../../db/schema"
import { eq } from "drizzle-orm"

const CancelOrderSchema = z.object({
  order_id: z.string().trim(),
  ph_no: z.string().trim().min(8),
})

type CancelOrderRequest = z.infer<typeof CancelOrderSchema>

export async function cancelOrder(c: Context) {
  try {
    const body = await c.req.json()
    const parsed = CancelOrderSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400)
    }

    const data: CancelOrderRequest = parsed.data
    const db = getDB(c.env.DB)

    // Fetch order
    const existing = await db.query.orders.findFirst({
      where: eq(orders.order_id, data.order_id),
    })

    if (!existing) {
      return c.json({ error: "Order not found" }, 404)
    }

    if (existing.customer_phone !== data.ph_no) {
      return c.json({ error: "Phone number does not match this order." }, 403)
    }

    if (existing.status === "cancelled") {
      return c.json({ message: "Order already cancelled." }, 200)
    }

    // Update order status
    await db
      .update(orders)
      .set({ status: "cancelled" })
      .where(eq(orders.order_id, data.order_id))
      .run()

    return c.json({
      success: true,
      message: `Order ${data.order_id} cancelled successfully.`,
    })
  } catch (error: any) {
    console.error("Cancel order failed", {
      error,
      timestamp: new Date().toISOString(),
    })
    return c.json({ error: "Internal Server Error" }, 500)
  }
}

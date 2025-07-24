import { Context } from 'hono'
import z from 'zod'
import { getDB } from '../../db/db'
import { orders } from '../../db/schema/orders'
import { orderItems } from '../../db/schema/orderItems'
import { customAlphabet } from 'nanoid'
import { D1Database } from '@cloudflare/workers-types'

export interface Env {
  DB: D1Database
}

const OrderItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().min(1),
})

const OrderRequestSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(8),
  customerAddress: z.string().min(5),
  paymentMethod: z.enum(['stripe', 'cash_on_delivery']),
  stripeToken: z.string().optional(),
  items: z.array(OrderItemSchema).min(1, "At least one item is required"),
})

type OrderItems = z.infer<typeof OrderItemSchema>
type OrderRequest = z.infer<typeof OrderRequestSchema>

// NanoID generator for readable order IDs
const generateOrderId = () => {
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10)
  return `ORD_${nanoid()}`
}

export async function placeOrder(c: Context) {
  try {
    const body = await c.req.json()
    const parsed = OrderRequestSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400)
    }

    const order: OrderRequest = parsed.data
    const db = getDB(c.env.DB)

    const order_id = generateOrderId()
    const created_at = new Date().toISOString()

    const total_amount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // Insert into orders table
    await db.insert(orders).values({
      order_id,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_address: order.customerAddress,
      total_amount,
      status: 'pending',
      payment_method: order.paymentMethod,
      payment_status: 'pending',
      stripe_payment_id: order.stripeToken ?? null,
      created_at,
    }).run()

    // Insert orderItems 
    await db.insert(orderItems).values(
      order.items.map((item) => ({
        order_id,
        name: item.name,
        price: item.price.toString(),
        quantity: item.quantity.toString(),
      }))
    ).run()

    return c.json({
      success: true,
      orderId: order_id,
      totalAmount: total_amount,
      message: 'Order placed successfully',
    })
  } catch (error) {
    console.error('Error placing order:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

import { D1Database } from '@cloudflare/workers-types'
import { Context } from 'hono'
import { customAlphabet } from 'nanoid'
import z from 'zod'
import { getDB } from '../../db/db'
import { orderItems } from '../../db/schema/orderItems'
import { orders } from '../../db/schema/orders'
import crypto from 'crypto'

export interface Env {
  DB: D1Database
}

// 👇 Replace this with your actual Razorpay TEST secret securely in production

const OrderItemSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().min(1),
})

const OrderRequestSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(8),
  customerAddress: z.string().min(5),
  paymentMethod: z.enum(['razorpay', 'cash_on_delivery']),
  items: z.array(OrderItemSchema).min(1, "At least one item is required"),
  razorpay_payment_id: z.string().optional(),
  razorpay_order_id: z.string().optional(),
  razorpay_signature: z.string().optional(),
})

type OrderItems = z.infer<typeof OrderItemSchema>
type OrderRequest = z.infer<typeof OrderRequestSchema>

// NanoID generator for readable order IDs
const generateOrderId = () => {
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10)
  return `ORD_${nanoid()}`
}

// Helper to verify Razorpay signature
function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const body = `${orderId}|${paymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  return expectedSignature === signature
}

export async function placeOrder(c: Context) {
  try {
    const body = await c.req.json()
    console.log(body);
    
    const parsed = OrderRequestSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: parsed.error.message }, 400)
    }

    const order = parsed.data
    const db = getDB(c.env.DB)
    const created_at = new Date().toISOString()
    const total_amount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // 🛡️ Verify Razorpay signature if Razorpay is used
    if (order.paymentMethod === 'razorpay') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = order

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return c.json({ error: 'Missing Razorpay payment details' }, 400)
      }
      const RAZORPAY_SECRET = c.env.RAZORPAY_SECRET_KEY
      const isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        RAZORPAY_SECRET
      )

      if (!isValid) {
        return c.json({ error: 'Invalid Razorpay payment signature' }, 400)
      }
    }

    // ✅ Only proceed to place order after verification
    let order_id: string
    while (true) {
      order_id = generateOrderId()
      const existing = await db.query.orders.findFirst({
        where: (fields, { eq }) => eq(fields.order_id, order_id)
      })
      if (!existing) break
    }

    // Create batch of queries
    const insertOrderQuery = db.insert(orders).values({
      order_id,
      customer_name: order.customerName.trim(),
      customer_phone: order.customerPhone,
      customer_address: order.customerAddress.trim(),
      total_amount,
      status: 'pending',
      payment_method: order.paymentMethod,
      payment_status: order.paymentMethod === 'razorpay' ? 'paid' : 'pending',
      razorpay_order_id: order.razorpay_order_id ?? null,
      razorpay_payment_id: order.razorpay_payment_id ?? null,
      razorpay_signature: order.razorpay_signature ?? null,
      created_at,
    })

    const insertItemQueries = order.items.map((item) =>
      db.insert(orderItems).values({
        order_id,
        name: item.name.trim(),
        price: item.price.toString(),
        quantity: item.quantity.toString(),
      })
    )

    // Execute batch
    await db.batch([insertOrderQuery, ...insertItemQueries])

    return c.json({
      success: true,
      orderId: order_id,
      totalAmount: total_amount,
      createdAt: created_at,
      message: 'Order placed successfully',
    })
  } catch (error) {
    console.error('Order Placement Failed', {
      error,
      timestamp: new Date().toISOString(),
    })
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

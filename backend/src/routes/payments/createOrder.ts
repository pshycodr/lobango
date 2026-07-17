import Razorpay from 'razorpay'
import { Context } from 'hono'


export async function createRazorpayOrder(c: Context) {
    const razorpay = new Razorpay({
        key_id: c.env.RAZORPAY_KEY_ID,
        key_secret: c.env.RAZORPAY_SECRET_KEY,
    })

    console.log(c.env.RAZORPAY_KEY_ID, c.env.RAZORPAY_SECRET_KEY, await c.req.json());

    const { amount, currency = 'INR' } = await c.req.json()

    if (!amount || isNaN(amount)) {
        return c.json({ error: 'Amount is required' }, 400)
    }

    try {
        const options = {
            amount: amount * 100, // convert to paisa
            currency,
            receipt: `rcpt_${Date.now()}`,
            payment_capture: 1,
        }

        const order = await razorpay.orders.create(options)

        return c.json({
            razorpayOrderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: c.env.RAZORPAY_KEY_ID,
        })
    } catch (err) {
        console.error('Failed to create Razorpay order', err)
        return c.json({ error: 'Failed to create order' }, 500)
    }
}

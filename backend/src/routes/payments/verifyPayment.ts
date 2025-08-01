import { Context } from "hono"
import crypto from 'crypto'
import z from "zod"

const verifyRazorPaySchema = z.object({
    orderId: z.string(),
    paymentId: z.string(),
    signature: z.string()
})

type verifyPayment = z.infer<typeof verifyRazorPaySchema>


export async function verifyRazorpaySignature(c: Context) {

    try {
        const data: verifyPayment = await c.req.json()
        const { success } = verifyRazorPaySchema.safeParse(data)

        if (!success) {
            return c.json({
                success: false
            })
        }

        const body = `${data.orderId}|${data.paymentId}`
        const expectedSignature = crypto
            .createHmac('sha256', c.env.RAZORPAY_SECRET_KEY)
            .update(body)
            .digest('hex')
        return c.json({
            success: expectedSignature === data.signature
        })

    } catch (error) {
        return c.json({
            success: false
        })
    }
}

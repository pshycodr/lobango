import * as Brevo from '@getbrevo/brevo'
import { newOrderHtmlTemplate } from '../template/email/newOrder'

export function brevoClient(apiKey: string) {
  const client = new Brevo.TransactionalEmailsApi()
  client.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey)
  return client
}

interface Env {
    BREVO_API_KEY: string
    BREVO_SENDER_EMAIL: string
    BREVO_SENDER_NAME: string
}

export async function sendOrderEmail(
  env: Env, 
  to: string, 
  name: string, 
  total: string,
  orderId: string,
  customerPhone: string,
  customerAddress: string
) {
    console.log(env);
    
  const client = brevoClient(env.BREVO_API_KEY)

  const html = newOrderHtmlTemplate({name, total, orderId, customerAddress, customerPhone})

  const textContent = `
    LOBANGO - Order Confirmation

    Hello ${name},

    Thank you for your order. We have received your request and our team is preparing your meal.

    Order Details:
    - Order ID: ${orderId}
    - Total Amount: ₹${total}
    - Contact: ${customerPhone}
    - Delivery Address: ${customerAddress}

    Status: ORDER CONFIRMED

    Track your order: https://lobango.in/order-tracking/?orderId=${orderId}

    Thank you for choosing Lobango.

    ---
    Questions? Contact us at support@lobango.in
    `

  const payload: Brevo.SendSmtpEmail = {
    subject: `Order ${orderId} Confirmed`,
    sender: { email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME || 'Lobango' },
    to: [{ email: to, name }],
    htmlContent: html,
    textContent: textContent
  }

  return await client.sendTransacEmail(payload)
}
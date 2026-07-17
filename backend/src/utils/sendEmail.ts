import * as Brevo from '@getbrevo/brevo'
import { newOrderHtmlTemplate } from '../template/email/newOrder'
import { bookingConfirmationHtmlTemplate } from '../template/email/newBooking'

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

// Order email data interface
interface OrderEmailData {
    type: 'order'
    to: string
    name: string
    total: string
    orderId: string
    customerPhone: string
    customerAddress: string
}

// Booking email data interface
interface BookingEmailData {
    type: 'booking'
    to: string
    customer_name: string
    booking_id: string
    customer_phone: string
    customer_email: string
    date: string // YYYY-MM-DD
    time: string // HH:mm
    number_of_people: number
}

// Union type for email data
type EmailData = OrderEmailData | BookingEmailData

// Parameters for sendEmail function
interface SendEmailParams {
    env: Env
    data: EmailData
}

// Parameters for sendOrderEmail function
interface SendOrderEmailParams {
    env: Env
    to: string
    name: string
    total: string
    orderId: string
    customerPhone: string
    customerAddress: string
}

// Parameters for sendBookingEmail function
interface SendBookingEmailParams {
    env: Env
    to: string
    customer_name: string
    booking_id: string
    customer_phone: string
    customer_email: string
    date: string
    time: string
    number_of_people: number
}

export async function sendEmail({ env, data }: SendEmailParams) {
    console.log(env);
   
    const client = brevoClient(env.BREVO_API_KEY)
   
    let emailContent: { text: string; html: string }
    let subject: string
    let recipientName: string
    let recipientEmail: string

    if (data.type === 'order') {
        // Handle order confirmation email
        emailContent = newOrderHtmlTemplate({
            name: data.name,
            total: data.total,
            orderId: data.orderId,
            customerAddress: data.customerAddress,
            customerPhone: data.customerPhone
        })
        subject = `Order ${data.orderId} Confirmed`
        recipientName = data.name
        recipientEmail = data.to
       
    } else if (data.type === 'booking') {
        // Handle booking confirmation email
        emailContent = bookingConfirmationHtmlTemplate({
            customer_name: data.customer_name,
            booking_id: data.booking_id,
            customer_phone: data.customer_phone,
            customer_email: data.customer_email,
            date: data.date,
            time: data.time,
            number_of_people: data.number_of_people
        })
        subject = `Reservation ${data.booking_id} Confirmed`
        recipientName = data.customer_name
        recipientEmail = data.to
       
    } else {
        throw new Error('Invalid email type')
    }

    const payload: Brevo.SendSmtpEmail = {
        subject,
        sender: { email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME || 'Lobango' },
        to: [{ email: recipientEmail, name: recipientName }],
        htmlContent: emailContent.html,
        textContent: emailContent.text
    }

    return await client.sendTransacEmail(payload)
}

// Legacy function for backward compatibility (optional)
export async function sendOrderEmail({
    env,
    to,
    name,
    total,
    orderId,
    customerPhone,
    customerAddress
}: SendOrderEmailParams) {
    return sendEmail({
        env,
        data: {
            type: 'order',
            to,
            name,
            total,
            orderId,
            customerPhone,
            customerAddress
        }
    })
}

// booking emails
export async function sendBookingEmail({
    env,
    to,
    customer_name,
    booking_id,
    customer_phone,
    customer_email,
    date,
    time,
    number_of_people
}: SendBookingEmailParams) {
    return sendEmail({
        env,
        data: {
            type: 'booking',
            to,
            customer_name,
            booking_id,
            customer_phone,
            customer_email,
            date,
            time,
            number_of_people
        }
    })
}
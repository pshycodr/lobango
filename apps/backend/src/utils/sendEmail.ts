import type {
  BookingConfirmedEmailData,
  BookingStatusUpdateEmailData,
  EmailBookingStatus,
  EmailData,
  EmailOrderStatus,
  OrderPlacedEmailData,
  OrderStatusUpdateEmailData,
  OtpEmailData,
  SendEmailEnv,
  SendEmailParams,
} from "@/types/email";
import {
  bookingStatusUpdateHtmlTemplate,
  type BookingStatus as TemplateBookingStatus,
} from "../template/email/bookingStatusUpdate";
import { bookingConfirmationHtmlTemplate } from "../template/email/newBooking";
import { newOrderHtmlTemplate } from "../template/email/newOrder";
import {
  orderStatusUpdateHtmlTemplate,
  type OrderStatus as TemplateOrderStatus,
} from "../template/email/orderStatusUpdate";
import { otpHtmlTemplate } from "../template/email/otp";

export type {
  BookingConfirmedEmailData,
  BookingStatusUpdateEmailData,
  EmailBookingStatus,
  EmailData,
  EmailOrderStatus,
  OrderPlacedEmailData,
  OrderStatusUpdateEmailData,
  OtpEmailData,
  SendEmailEnv,
  SendEmailParams,
} from "@/types/email";

/**
 * Thrown when a transactional email fails to send or is malformed.
 */
export class EmailDeliveryError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "EmailDeliveryError";
  }
}

interface RenderedEmail {
  subject: string;
  recipientName: string;
  content: { html: string; text: string };
}

type EmailDefinitions = {
  [K in EmailData["type"]]: (
    data: Extract<EmailData, { type: K }>
  ) => RenderedEmail;
};

function toTemplateOrderStatus(status: EmailOrderStatus): TemplateOrderStatus {
  return status === "canceld" ? "cancelled" : status;
}

function toTemplateBookingStatus(
  status: EmailBookingStatus
): TemplateBookingStatus {
  return status === "rejected" ? "cancelled" : status;
}

const emailDefinitions: EmailDefinitions = {
  order_placed: (data) => ({
    subject: `Order ${data.orderId} Confirmed - Lobango`,
    recipientName: data.name,
    content: newOrderHtmlTemplate({
      name: data.name,
      total: data.total,
      orderId: data.orderId,
      customerAddress: data.customerAddress,
      customerPhone: data.customerPhone,
    }),
  }),

  order_status_update: (data) => {
    const templateStatus = toTemplateOrderStatus(data.status);
    return {
      subject: `Order ${data.orderId} Update - ${formatStatus(data.status)}`,
      recipientName: data.name,
      content: orderStatusUpdateHtmlTemplate({
        customer_name: data.name,
        order_id: data.orderId,
        status: templateStatus,
        reason: data.reason,
      }),
    };
  },

  booking_confirmed: (data) => ({
    subject: `Reservation ${data.bookingId} Confirmed - Lobango`,
    recipientName: data.customerName,
    content: bookingConfirmationHtmlTemplate({
      customer_name: data.customerName,
      booking_id: data.bookingId,
      customer_phone: data.customerPhone,
      customer_email: data.customerEmail,
      date: data.date,
      time: data.time,
      number_of_people: data.numberOfPeople,
    }),
  }),

  booking_status_update: (data) => {
    const templateStatus = toTemplateBookingStatus(data.status);
    return {
      subject: `Reservation ${data.bookingId} Update - ${formatStatus(data.status)}`,
      recipientName: data.customerName,
      content: bookingStatusUpdateHtmlTemplate({
        customer_name: data.customerName,
        booking_id: data.bookingId,
        status: templateStatus,
        date: data.date,
        time: data.time,
        reason: data.reason,
      }),
    };
  },

  otp: (data) => ({
    subject: `Your verification code: ${data.otp}`,
    recipientName: data.name ?? "Customer",
    content: otpHtmlTemplate({
      customer_name: data.name ?? "Customer",
      otp: data.otp,
      expiry_minutes: data.expiresInMinutes,
    }),
  }),
};

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function renderEmail(data: EmailData): RenderedEmail {
  const definition = emailDefinitions[data.type] as (
    data: EmailData
  ) => RenderedEmail;
  return definition(data);
}

export async function sendEmail({ env, data }: SendEmailParams) {
  const apiKey = env.BREVO_API_KEY;

  if (!apiKey) {
    throw new EmailDeliveryError("Brevo API key is not configured");
  }

  const { subject, recipientName, content } = renderEmail(data);

  const payload = {
    subject,
    sender: {
      email: env.BREVO_SENDER_EMAIL,
      name: env.BREVO_SENDER_NAME,
    },
    to: [{ email: data.to, name: recipientName }],
    htmlContent: content.html,
    textContent: content.text,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw new EmailDeliveryError(
      `Failed to send "${data.type}" email to ${data.to}`,
      error
    );
  }
}

export function sendOrderPlacedEmail(
  params: Omit<OrderPlacedEmailData, "type"> & { env: SendEmailEnv }
) {
  const { env, ...data } = params;
  return sendEmail({ env, data: { type: "order_placed", ...data } });
}

export function sendOrderStatusUpdateEmail(
  params: Omit<OrderStatusUpdateEmailData, "type"> & { env: SendEmailEnv }
) {
  const { env, ...data } = params;
  return sendEmail({ env, data: { type: "order_status_update", ...data } });
}

export function sendBookingConfirmedEmail(
  params: Omit<BookingConfirmedEmailData, "type"> & { env: SendEmailEnv }
) {
  const { env, ...data } = params;
  return sendEmail({ env, data: { type: "booking_confirmed", ...data } });
}

export function sendBookingStatusUpdateEmail(
  params: Omit<BookingStatusUpdateEmailData, "type"> & { env: SendEmailEnv }
) {
  const { env, ...data } = params;
  return sendEmail({ env, data: { type: "booking_status_update", ...data } });
}

export function sendOtpEmail(
  params: Omit<OtpEmailData, "type"> & { env: SendEmailEnv }
) {
  const { env, ...data } = params;
  return sendEmail({ env, data: { type: "otp", ...data } });
}

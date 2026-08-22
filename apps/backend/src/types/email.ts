import type { BookingStatus, OrderStatus } from "@lobango/contracts/enums";

export interface SendEmailEnv {
  BREVO_API_KEY: string;
  BREVO_SENDER_EMAIL: string;
  BREVO_SENDER_NAME?: string;
}

/** Order statuses according to email template. */
export type EmailOrderStatus = Exclude<
  OrderStatus,
  "pending" | "accepted" | "out_for_delivery"
>;

/** Booking statuses according to email template. */
export type EmailBookingStatus = Exclude<
  BookingStatus,
  "pending" | "completed"
>;

export function isEmailWorthyOrderStatus(
  status: OrderStatus
): status is EmailOrderStatus {
  return (
    status === "delivered" || status === "canceld" || status === "rejected"
  );
}

export function isEmailWorthyBookingStatus(
  status: BookingStatus
): status is EmailBookingStatus {
  return (
    status === "accepted" || status === "cancelled" || status === "rejected"
  );
}

// Email Payloads

export interface OrderPlacedEmailData {
  type: "order_placed";
  to: string;
  name: string;
  total: string;
  orderId: string;
  customerPhone: string;
  customerAddress: string;
}

export interface OrderStatusUpdateEmailData {
  type: "order_status_update";
  to: string;
  name: string;
  orderId: string;
  status: EmailOrderStatus;
  reason?: string;
}

export interface BookingConfirmedEmailData {
  type: "booking_confirmed";
  to: string;
  customerName: string;
  bookingId: string;
  customerPhone: string;
  customerEmail: string;
  /** ISO date, format `YYYY-MM-DD`. */
  date: string;
  /** 24-hour time, format `HH:mm`. */
  time: string;
  numberOfPeople: number;
}

export interface BookingStatusUpdateEmailData {
  type: "booking_status_update";
  to: string;
  customerName: string;
  bookingId: string;
  status: EmailBookingStatus;
  date: string;
  time: string;
  reason?: string;
}

export interface OtpEmailData {
  type: "otp";
  to: string;
  name?: string;
  otp: string;
  expiresInMinutes: number;
}

export type EmailData =
  | OrderPlacedEmailData
  | OrderStatusUpdateEmailData
  | BookingConfirmedEmailData
  | BookingStatusUpdateEmailData
  | OtpEmailData;

export interface SendEmailParams {
  env: SendEmailEnv;
  data: EmailData;
}

import type { EmailBookingStatus, EmailOrderStatus } from "./email";

export interface OrderConfirmationEmail {
  type: "order-confirmation";
  to: string;
  name: string;
  total: string;
  orderId: string;
  customerPhone: string;
  customerAddress: string;
}

export interface OrderStatusUpdateEmail {
  type: "order-status-update";
  to: string;
  name: string;
  orderId: string;
  status: EmailOrderStatus;
  reason?: string;
}

export interface BookingConfirmationEmail {
  type: "booking-confirmation";
  to: string;
  customerName: string;
  bookingId: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  numberOfPeople: number;
}

export interface BookingStatusUpdateEmail {
  type: "booking-status-update";
  to: string;
  customerName: string;
  bookingId: string;
  status: EmailBookingStatus;
  date: string;
  time: string;
  reason?: string;
}

export interface OtpEmail {
  type: "otp";
  to: string;
  name?: string;
  otp: string;
  expiresInMinutes: number;
}

export type EmailQueueMessage =
  | OrderConfirmationEmail
  | OrderStatusUpdateEmail
  | BookingConfirmationEmail
  | BookingStatusUpdateEmail
  | OtpEmail;

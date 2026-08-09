export const orderStatusValues = [
  "pending",
  "accepted",
  "delivered",
  "cancelled",
  "rejected",
] as const;
export type OrderStatus = (typeof orderStatusValues)[number];

export const bookingStatusValues = [
  "pending",
  "accepted",
  "completed",
  "cancelled",
  "rejected",
] as const;
export type BookingStatus = (typeof bookingStatusValues)[number];

export const paymentStatusValues = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;
export type PaymentStatus = (typeof paymentStatusValues)[number];

export const paymentMethodValues = [
  "razorpay",
  // "cash_on_delivery",
] as const;
export type PaymenyMethodStatus = (typeof paymentMethodValues)[number];

import { z } from "zod";

export const paymentStatusValues = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

export const PaymentStatusSchema = z.enum(paymentStatusValues);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const paymentMethodValues = [
  "razorpay",
  // "cash_on_delivery",
] as const;

export const PaymentMethodsSchema = z.enum(paymentMethodValues);
export type PaymentMethods = z.infer<typeof PaymentMethodsSchema>;

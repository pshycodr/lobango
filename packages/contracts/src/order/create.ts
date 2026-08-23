import { z } from "zod";
import { PaymentMethodsSchema } from "../enums";

export const CreateOrderItemSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().min(1),
});

export type CreateOrderItem = z.infer<typeof CreateOrderItemSchema>;

export const CreateOrderSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(8),
  customerEmail: z.string().email(),
  customerAddress: z.string().min(1),
  longitude: z.string(),
  latitude: z.string(),
  paymentMethod: PaymentMethodsSchema,
  items: z.array(CreateOrderItemSchema).min(1, "At least one item is required"),
});

export type CreateOrder = z.infer<typeof CreateOrderSchema>;

export const RazorPaySchema = z.object({
  razorpay_payment_id: z.string().optional(),
  razorpay_order_id: z.string().optional(),
  razorpay_signature: z.string().optional(),
});

export type RazorPay = z.infer<typeof RazorPaySchema>;

export const CreateOrderRequestSchema = z.object({
  order: CreateOrderSchema,
  razorpay: RazorPaySchema,
});

export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;

export const CreateOrderResponseSchema = z.object({
  success: z.boolean(),
  orderId: z.string(),
  totalAmount: z.string(),
  createdAt: z.string(),
  message: z.string(),
});

export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;

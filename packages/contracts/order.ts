import { z } from "zod";

export const OrderItemSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().min(1),
});

export const OrderSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(8),
  customerEmail: z.email(),
  customerAddress: z.string().min(5),
  longitude: z.string(),
  latitude: z.string(),
  paymentMethod: z.enum(["razorpay", "cash_on_delivery"]),
  items: z.array(OrderItemSchema).min(1, "At least one item is required"),
});

export const RazorPaySchema = z.object({
  razorpay_payment_id: z.string().optional(),
  razorpay_order_id: z.string().optional(),
  razorpay_signature: z.string().optional(),
});

export const OrderRequestSchema = z.object({
  order: OrderSchema,
  razorpay: RazorPaySchema,
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type RazorPay = z.infer<typeof RazorPaySchema>;
export type OrderRequest = z.infer<typeof OrderRequestSchema>;

import { z } from "zod";
import {
  OrderStatusSchema,
  PaymentMethodsSchema,
  PaymentStatusSchema,
} from "../enums";

export const OrderSchema = z.object({
  id: z.number(),
  orderId: z.string().trim(),
  customerName: z.string().trim(),
  customerPhone: z.string().trim(),
  customerAddress: z.string().trim(),
  customerEmail: z.email(),
  longitude: z.string().trim().nullable(),
  latitude: z.string().trim().nullable(),
  totalAmount: z.string().trim(),
  paymentMethod: PaymentMethodsSchema,
  paymentStatus: PaymentStatusSchema,
  createdAt: z.string().trim(),
  status: OrderStatusSchema,
});

export type Order = z.infer<typeof OrderSchema>;

export const OrderItemSchema = z.object({
  id: z.number(),
  name: z.string().trim(),
  price: z.string().trim(),
  quantity: z.string().trim(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

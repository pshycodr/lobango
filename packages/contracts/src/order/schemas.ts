import { z } from "zod";
import {
  OrderStatusSchema,
  PaymentMethodsSchema,
  PaymentStatusSchema,
} from "../enums";

export const OrderSchema = z.object({
  id: z.number(),
  orderId: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerAddress: z.string(),
  customerEmail: z.email(),
  longitude: z.string().nullable(),
  latitude: z.string().nullable(),
  totalAmount: z.string(),
  paymentMethod: PaymentMethodsSchema,
  paymentStatus: PaymentStatusSchema,
  createdAt: z.string().nullable(),
  status: OrderStatusSchema,
});

export type Order = z.infer<typeof OrderSchema>;

export const OrderItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  quantity: z.string(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

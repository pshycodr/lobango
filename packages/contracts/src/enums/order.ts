import { z } from "zod";

export const orderStatusValues = [
  "pending",
  "accepted",
  "out_for_delivery",
  "delivered",
  "canceld",
  "rejected",
] as const;

export const OrderStatusSchema = z.enum(orderStatusValues);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

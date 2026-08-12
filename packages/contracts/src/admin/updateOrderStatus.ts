import { z } from "zod";

export const OrderStatusUpdateSchema = z.object({
  orderId: z.string(),
  status: z.enum([
    "pending",
    "accepted",
    "out_for_delivery",
    "delivered",
    "canceld",
    "rejected",
  ]),
});

export type OrderStatusUpdate = z.infer<typeof OrderStatusUpdateSchema>;

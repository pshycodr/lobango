
import {z} from "zod"


export const OrderStatusUpdateSchema = z.object({
  orderId: z.string(),
  status: z.enum([
    "pending",
    "accepted",
    "out for delivery",
    "delivered",
    "rejected",
  ]),
});


export type OrderStatusUpdate = z.infer<typeof OrderStatusUpdateSchema>

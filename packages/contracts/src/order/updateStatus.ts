import { z } from "zod";
import { OrderStatusSchema } from "../enums";

export const UpdateOrderStatusRequestSchema = z.object({
  orderId: z.string(),
  status: OrderStatusSchema,
});

export type UpdateOrderStatusRequest = z.infer<
  typeof UpdateOrderStatusRequestSchema
>;

export const UpdateOrderStatusResponseSchema = z.object({
  success: z.boolean(),
});

export type UpdateOrderStatusResponse = z.infer<
  typeof UpdateOrderStatusResponseSchema
>;

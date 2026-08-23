import { z } from "zod";

export const CancelOrderRequestSchema = z.object({
  orderId: z.string(),
  actionToken: z.string(),
});

export type CancelOrderRequest = z.infer<typeof CancelOrderRequestSchema>;

export const CancelOrderResponseSchema = z.object({
  success: z.boolean(),
  orderId: z.string(),
  message: z.string().optional(),
});

export type CancelOrderResponse = z.infer<typeof CancelOrderResponseSchema>;

import z from "zod";
import { OrderItemSchema, OrderSchema } from "./schemas";

export const GetOrderByIdRequestSchema = z.object({
  orderId: z.string().trim(),
});

export type GetOrderByIdRequest = z.infer<typeof GetOrderByIdRequestSchema>;

export const GetOrderByIdResponseSchema = z.object({
  success: z.literal(true),
  order: OrderSchema,
  items: z.array(OrderItemSchema),
});

export type GetOrderByIdResponse = z.infer<typeof GetOrderByIdResponseSchema>;

import { z } from "zod";

export const CreateRazorPayOrderRequestSchema = z.object({
  amount: z
    .string()
    .regex(/^\d+$/)
    .describe("Order amount in paise as a numeric string"),
  currency: z.literal("INR").default("INR"),
});

export type CreateRazorPayOrderRequest = z.infer<
  typeof CreateRazorPayOrderRequestSchema
>;

export const CreateRazorPayOrderResponseSchema = z.object({
  currency: z.literal("INR"),
  amount: z.string(),
  key_id: z.string().describe("Razorpay public key ID used by the client"),
  razorpayOrderId: z.string().describe("Unique Razorpay order ID"),
});

export type CreateRazorPayOrderResponse = z.infer<
  typeof CreateRazorPayOrderResponseSchema
>;

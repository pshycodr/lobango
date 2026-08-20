import { z } from "zod";

export const VerifyRazorPaySignatureRequestSchema = z.object({
  orderId: z.string().describe("Razorpay order ID associated with the payment"),
  paymentId: z
    .string()
    .describe("Razorpay payment ID returned after the payment"),
  signature: z
    .string()
    .describe("Razorpay payment signature used to verify the payment"),
});

export type VerifyRazorPaySignatureRequest = z.infer<
  typeof VerifyRazorPaySignatureRequestSchema
>;

export const VerifyRazorPaySignatureResponseSchema = z.object({
  success: z.boolean(),
});

export type VerifyRazorPaySignatureResponse = z.infer<
  typeof VerifyRazorPaySignatureResponseSchema
>;

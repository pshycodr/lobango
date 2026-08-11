import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import crypto from "crypto";
import { z } from "zod";

const VerifyRazorPaySignatureInput = z.object({
  orderId: z.string().describe("Razorpay order ID associated with the payment"),
  paymentId: z
    .string()
    .describe("Razorpay payment ID returned after the payment"),
  signature: z
    .string()
    .describe("Razorpay payment signature used to verify the payment"),
});

const VerifyRazorPaySignatureOutput = z.object({
  success: z.boolean(),
});

export const verifyRazorpaySignature = orpc
  .route({
    method: "POST",
    path: "/payments/razorpay/verify",
    summary: "Verify Razorpay payment signature",
    description:
      "Verifies the Razorpay payment signature using the server-side Razorpay secret key.",
    tags: [API_TAGS.PAYMENTS],
  })
  .input(VerifyRazorPaySignatureInput)
  .output(VerifyRazorPaySignatureOutput)
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: "failed to verify razorpay signature",
    },
  })
  .handler(async ({ input, context, errors }) => {
    try {
      const body = `${input.orderId}|${input.paymentId}`;

      const expectedSignature = crypto
        .createHmac("sha256", context.env.RAZORPAY_SECRET_KEY)
        .update(body)
        .digest("hex");

      return {
        success: expectedSignature === input.signature,
      };
    } catch (error) {
      console.error("Failed to verify Razorpay signature", error);

      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

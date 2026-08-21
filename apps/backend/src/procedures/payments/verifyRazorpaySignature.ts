import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import {
  VerifyRazorPaySignatureRequestSchema,
  VerifyRazorPaySignatureResponseSchema,
} from "@lobango/contracts/payments/razorpay";
import crypto from "crypto";

export const verifyRazorpaySignature = orpc
  .route({
    method: "POST",
    path: "/payments/razorpay/verify",
    summary: "Verify Razorpay payment signature",
    description:
      "Verifies the Razorpay payment signature using the server-side Razorpay secret key.",
    tags: [API_TAGS.PAYMENTS],
  })
  .input(VerifyRazorPaySignatureRequestSchema)
  .output(VerifyRazorPaySignatureResponseSchema)
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

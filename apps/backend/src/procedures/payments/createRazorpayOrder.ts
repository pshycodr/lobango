import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import Razorpay from "razorpay";
import { z } from "zod";

const CreateRazorPayOrderInput = z.object({
  amount: z
    .string()
    .regex(/^\d+$/)
    .describe("Order amount in paise as a numeric string"),
  currency: z.literal("INR").default("INR"),
});

const CreateRazorPayOrderOutput = z.object({
  currency: z.literal("INR"),
  amount: z.string(),
  key_id: z.string().describe("Razorpay public key ID used by the client"),
  razorpayOrderId: z.string().describe("Unique Razorpay order ID"),
});

export const createRazorpayOrder = orpc
  .route({
    method: "POST",
    path: "/payments/razorpay/orders",
    summary: "Create a Razorpay order",
    description: "Creates a Razorpay order for the specified amount.",
    tags: [API_TAGS.PAYMENTS],
  })
  .input(CreateRazorPayOrderInput)
  .output(CreateRazorPayOrderOutput)
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: "failed to create razorpay order",
    },
  })
  .handler(async ({ input, context, errors }) => {
    const razorpay = new Razorpay({
      key_id: context.env.RAZORPAY_KEY_ID,
      key_secret: context.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: input.amount,
      currency: input.currency,
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    try {
      const order = await razorpay.orders.create(options);

      return {
        razorpayOrderId: order.id,
        amount: String(order.amount),
        currency: "INR",
        key_id: context.env.RAZORPAY_KEY_ID,
      };
    } catch (err) {
      console.error("Failed to create Razorpay order", err);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

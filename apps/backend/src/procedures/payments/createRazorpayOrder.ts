import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import {
  CreateRazorPayOrderRequestSchema,
  CreateRazorPayOrderResponseSchema,
} from "@lobango/contracts/payments/razorpay";
import Razorpay from "razorpay";

export const createRazorpayOrder = orpc
  .route({
    method: "POST",
    path: "/payments/razorpay/orders",
    summary: "Create a Razorpay order",
    description: "Creates a Razorpay order for the specified amount.",
    tags: [API_TAGS.PAYMENTS],
  })
  .input(CreateRazorPayOrderRequestSchema)
  .output(CreateRazorPayOrderResponseSchema)
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

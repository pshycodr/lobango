import { strictRateLimit } from "@/middleware/rateLimit";
import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { generateOtp, hashOtp, OTP_OWNERSHIP_CHECKS } from "@/utils/otp";
import {
  SendOtpEmailRequest,
  SendOtpEmailRequestSchema,
  SendOtpEmailResponseSchema,
} from "@lobango/contracts/otp";

const OTP_TTL_SECONDS = 300;

export const sendOtpEmail = orpc
  .route({
    method: "POST",
    path: "/otp/send",
    summary: "Send OTP email",
    description:
      "Generates and emails a one time code for the given purpose. Always returns success. ownership and rate-limit failures are intentionally not distinguishable in the response, to avoid leaking which emails/resources exist.",
    tags: [API_TAGS.SHARED.OTP],
  })
  .input(SendOtpEmailRequestSchema)
  .output(SendOtpEmailResponseSchema)
  .errors({
    TOO_MANY_REQUESTS: {
      message:
        "Too many OTP requests for this email. Try again in a few minutes.",
    },
  })
  .use(strictRateLimit<SendOtpEmailRequest>((_, context) => context.ip))
  .handler(async ({ input, context }) => {
    const check = OTP_OWNERSHIP_CHECKS[input.purpose];

    const ownershipOk = input.resourceId
      ? await check(context, input.email, input.resourceId)
      : input.purpose === "new_booking"; // purposes with no resourceId must explicitly allow that

    // identical response whether ownership failed or not
    if (!ownershipOk) {
      return { success: true as const };
    }

    const otp = generateOtp();
    const hash = await hashOtp(otp);

    await context.cache.set(
      context.cache.getKey.otpKey(input.purpose, input.email, input.resourceId),
      { hash, attempts: 0, expiresAt: Date.now() + OTP_TTL_SECONDS * 1000 },
      OTP_TTL_SECONDS
    );

    await context.env.EMAIL_QUEUE.send({
      type: "otp",
      to: input.email,
      name: input.name,
      otp,
      expiresInMinutes: 5,
    });

    return { success: true as const };
  });

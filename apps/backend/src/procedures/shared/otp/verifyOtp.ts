import { moderateRateLimit } from "@/middleware/rateLimit";
import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { hashOtp } from "@/utils/otp";
import {
  VrifyEmailOtpRequest,
  VrifyEmailOtpRequestSchema,
  VrifyEmailOtpResponseSchema,
} from "@lobango/contracts/otp";
import { timingSafeEqual } from "crypto";

export interface OtpActionData {
  email: string;
  purpose: string;
  resourceId: string | null;
}

export const verifyOtp = orpc
  .route({
    method: "POST",
    path: "/otp/verify",
    summary: "Verify OTP",
    description:
      "Validates an OTP for the specified email and purpose. The OTP expires after its configured TTL and is limited to five verification attempts. On successful verification, the OTP is consumed and a short-lived action token is returned for the next authorized operation.",
    tags: [API_TAGS.SHARED.OTP],
  })
  .input(VrifyEmailOtpRequestSchema)
  .output(VrifyEmailOtpResponseSchema)
  .use(moderateRateLimit<VrifyEmailOtpRequest>((_, context) => context.ip))
  .errors({
    INVALID_OTP: { status: 400, message: "Invalid or expired code" },
    TOO_MANY_REQUESTS: { message: "Too many attempts, request a new code" },
  })
  .handler(async ({ input, context, errors }) => {
    const key = context.cache.getKey.otpKey(
      input.purpose,
      input.email,
      input.resourceId
    );
    const record = await context.cache.get<{
      hash: string;
      attempts: number;
      expiresAt: number;
    }>(key);

    if (!record) throw errors.INVALID_OTP();
    if (record.attempts >= context.env.OTP_MAX_ATTEMPTS) {
      await context.cache.delete(key);
      throw errors.TOO_MANY_REQUESTS();
    }

    const isMatch = timingSafeEqual(
      Buffer.from(await hashOtp(input.otp)),
      Buffer.from(record.hash)
    );

    if (!isMatch) {
      const remaining = Math.max(
        1,
        Math.floor((record.expiresAt - Date.now()) / 1000)
      );
      await context.cache.set(
        key,
        { ...record, attempts: record.attempts + 1 },
        remaining
      );
      throw errors.INVALID_OTP();
    }

    await context.cache.delete(key);

    const actionToken = crypto.randomUUID();

    const otpActionData = {
      email: input.email,
      purpose: input.purpose,
      resourceId: input.resourceId ?? null,
    } satisfies OtpActionData;

    await context.cache.set(
      context.cache.getKey.otpActionKey(actionToken),
      otpActionData,
      context.env.OTP_ACTION_TOEKN_TTL
    );

    return { actionToken };
  });

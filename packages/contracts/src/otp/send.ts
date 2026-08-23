import { z } from "zod";

export const OTP_PURPOSES = ["cancel_order", "new_booking"] as const;
export type OtpPurpose = (typeof OTP_PURPOSES)[number];

export const SendOtpEmailRequestSchema = z.object({
  email: z.email(),
  name: z.string().optional(),
  purpose: z.enum(OTP_PURPOSES),
  resourceId: z.string().optional(),
});

export type SendOtpEmailRequest = z.infer<typeof SendOtpEmailRequestSchema>;

export const SendOtpEmailResponseSchema = z.object({
  success: z.literal(true),
});

export type SendOtpEmailResponse = z.infer<typeof SendOtpEmailResponseSchema>;

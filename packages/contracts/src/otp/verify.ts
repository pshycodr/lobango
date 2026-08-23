import { z } from "zod";
import { OTP_PURPOSES } from "./send";

export const VrifyEmailOtpRequestSchema = z.object({
  email: z.string().email(),
  purpose: z.enum(OTP_PURPOSES),
  resourceId: z.string().optional(),
  otp: z.string().length(6),
});

export type VrifyEmailOtpRequest = z.infer<typeof VrifyEmailOtpRequestSchema>;

export const VrifyEmailOtpResponseSchema = z.object({
  actionToken: z.string(),
});

export type VrifyEmailOtpResponse = z.infer<typeof VrifyEmailOtpResponseSchema>;

// Clean aliases
export const VerifyEmailOtpRequestSchema = VrifyEmailOtpRequestSchema;
export type VerifyEmailOtpRequest = VrifyEmailOtpRequest;

export const VerifyEmailOtpResponseSchema = VrifyEmailOtpResponseSchema;
export type VerifyEmailOtpResponse = VrifyEmailOtpResponse;

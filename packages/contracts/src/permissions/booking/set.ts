import { z } from "zod";

export const SetBookingPermissionRequestSchema = z.object({
  newBooking: z.boolean(),
});

export type SetBookingPermissionRequest = z.infer<
  typeof SetBookingPermissionRequestSchema
>;

export const SetBookingPermissionResponseSchema = z.object({
  success: z.boolean(),
  newBooking: z.boolean(),
});

export type SetBookingPermissionResponse = z.infer<
  typeof SetBookingPermissionResponseSchema
>;

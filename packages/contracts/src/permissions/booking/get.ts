import { z } from "zod";

export const GetBookingPermissionResponseSchema = z.object({
  success: z.boolean(),
  newBooking: z.boolean(),
});

export type GetBookingPermissionResponse = z.infer<
  typeof GetBookingPermissionResponseSchema
>;

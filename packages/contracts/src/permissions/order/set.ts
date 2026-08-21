import { z } from "zod";

export const SetOrderPermissionRequestSchema = z.object({
  newOrder: z.boolean(),
});

export type SetOrderPermissionRequest = z.infer<
  typeof SetOrderPermissionRequestSchema
>;

export const SetOrderPermissionResponseSchema = z.object({
  success: z.boolean(),
  newOrder: z.boolean(),
});

export type SetOrderPermissionResponse = z.infer<
  typeof SetOrderPermissionResponseSchema
>;

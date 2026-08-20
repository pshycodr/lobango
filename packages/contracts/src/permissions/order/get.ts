import { z } from "zod";

export const GetOrderPermissionResponseSchema = z.object({
  success: z.boolean(),
  newOrder: z.boolean(),
});

export type GetOrderPermissionResponse = z.infer<
  typeof GetOrderPermissionResponseSchema
>;

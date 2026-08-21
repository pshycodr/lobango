import { adminOrpc } from "@/orpc/base";
import { z } from "zod";

const VerifyAdminResponseSchema = z.object({
  success: z.boolean(),
});

export const verifyAdmin = adminOrpc
  .output(VerifyAdminResponseSchema)
  .handler(() => {
    return {
      success: true as const,
    };
  });

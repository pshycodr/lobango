import { adminOrpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { z } from "zod";

const VerifyAdminResponseSchema = z.object({
  success: z.boolean(),
});

export const verifyAdmin = adminOrpc
  .route({
    method: "POST",
    path: "/admin/login",
    tags: [API_TAGS.ADMIN.AUTH],
    summary: "Verify Admin user",
    description: "Verify admin login status and cookie token",
  })
  .output(VerifyAdminResponseSchema)
  .handler(() => {
    return {
      success: true as const,
    };
  });

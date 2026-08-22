import { adminOrpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { deleteCookie } from "hono/cookie";
import { z } from "zod";

const AdminLogoutOutput = z.object({
  success: z.literal(true),
});

export const adminLogout = adminOrpc
  .route({
    method: "POST",
    path: "/admin/logout",
    tags: [API_TAGS.ADMIN.AUTH],
    summary: "Logout admin user",
    description: "Clears the admin authentication cookie.",
  })
  .output(AdminLogoutOutput)
  .handler(async ({ context }) => {
    deleteCookie(context.hono, context.env.ADMIN_AUTH_COOKIE_KEY, {
      path: "/",
    });

    return {
      success: true as const,
    };
  });

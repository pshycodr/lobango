import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { ORPCError } from "@orpc/server";
import { os } from "@orpc/server";
import type { ORPCContext } from "@/orpc/context";

export const adminAuthMiddleware = os
  .$context<ORPCContext>()
  .middleware(async ({ context, next }) => {
    const token = getCookie(context.hono, "admin_token");

    if (!token) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Unauthorized",
      });
    }

    try {
      const payload = await verify(token, context.env.JWT_SECRET, "HS256");

      return next({
        context: {
          ...context,
          admin: payload,
        },
      });
    } catch {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Invalid or expired token",
      });
    }
  });

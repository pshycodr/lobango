import type { ORPCContext } from "@/orpc/context";
import { ORPCError, os } from "@orpc/server";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export const adminAuthMiddleware = os
  .$context<ORPCContext>()
  .middleware(async ({ context, next }) => {
    const token = getCookie(context.hono, context.env.ADMIN_AUTH_COOKIE_KEY);

    if (!token) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Unauthorized",
      });
    }

    try {
      const payload = await verify(
        token,
        context.env.JWT_SECRET,
        context.env.JWT_SINATURE_ALGO
      );

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

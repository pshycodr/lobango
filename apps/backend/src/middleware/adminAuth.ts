import { orpc } from "@/orpc/base";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export const adminAuthMiddleware = orpc
  .errors({
    UNAUTHORIZED: {
      message: "Unauthorized",
    },
  })
  .middleware(async ({ context, next, errors }) => {
    const token = getCookie(context.hono, context.env.ADMIN_AUTH_COOKIE_KEY);

    if (!token) {
      throw errors.UNAUTHORIZED();
    }

    try {
      const payload = await verify(
        token,
        context.env.JWT_SECRET,
        context.env.JWT_SINATURE_ALGO
      );

      return next({
        context: {
          admin: payload,
        },
      });
    } catch {
      throw errors.UNAUTHORIZED();
    }
  });

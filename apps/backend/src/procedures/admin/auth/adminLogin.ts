import { getDB } from "@/db/db";
import { admin } from "@/db/schema";
import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import {
  AdminLoginReqSchema,
  AdminLoginResSchema,
} from "@lobango/contracts/admin";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

export const adminLogin = orpc
  .route({
    method: "POST",
    path: "/admin/login",
    tags: [API_TAGS.ADMIN],
    summary: "Login Admin user",
    description:
      "Authenticates an admin using username and password and sets an HTTP-only JWT cookie.",
  })
  .input(AdminLoginReqSchema)
  .output(AdminLoginResSchema)
  .errors({
    UNAUTHORIZED: {
      message: "Invalid credentials",
    },
  })
  .handler(async ({ input, context, errors }) => {
    const db = getDB(context.env.DB);

    const result = await db
      .select()
      .from(admin)
      .where(eq(admin.username, input.username))
      .limit(1);

    if (!result.length) {
      throw errors.UNAUTHORIZED();
    }

    const user = result[0];

    const isValid = await bcrypt.compare(input.password, user.password);

    if (!isValid) {
      throw errors.UNAUTHORIZED();
    }

    const token = await sign(
      {
        username: user.username,
        exp: Math.floor(Date.now() / 1000) + context.env.ADMIN_AUTH_TOKEN_TTL,
      },
      context.env.JWT_SECRET,
      context.env.JWT_SINATURE_ALGO
    );

    setCookie(context.hono, context.env.ADMIN_AUTH_COOKIE_KEY, token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: context.env.ADMIN_AUTH_TOKEN_TTL,
    });

    return {
      success: true as const,
    };
  });

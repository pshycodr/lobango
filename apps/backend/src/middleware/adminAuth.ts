import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export const adminCheck = async (c: Context, next: Next) => {
  const token = getCookie(c, "admin_token");
  console.log(token);

  if (!token) return c.text("Unauthorized", 401);

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set("admin", payload);
    return next();
  } catch {
    return c.text("Invalid or expired token", 401);
  }
};

import { Context } from "hono";

export function withCookies(context: Context, response: Response) {
  const setCookieHeaders = context.res.headers.getSetCookie?.() ?? [];
  setCookieHeaders.forEach((cookie) =>
    response.headers.append("Set-Cookie", cookie)
  );
  return context.newResponse(response.body, response);
}

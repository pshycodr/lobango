import { Context } from "hono"
import { deleteCookie } from "hono/cookie"

export function adminLogout  (c: Context) {
    deleteCookie(c, 'admin_token', { path: '/' })
    return c.json({ success: true })
  }
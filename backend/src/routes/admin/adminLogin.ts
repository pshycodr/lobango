import bcrypt from "bcryptjs";
import { Context } from "hono";
import { sign } from "hono/jwt";
import { getDB } from "../../db/db";
import { admin } from "../../db/schema";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";

export async function adminLogin(c: Context) {
    const { username, password } = await c.req.json()
    const db = getDB(c.env.DB)
    const result = await db.select().from(admin).where(eq(admin.username, username)).limit(1)


    if (!result.length) return c.text('Invalid user', 401)

    const user = result[0]
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) return c.text('Invalid credentials', 401)
    

    const token = await sign(
        {
            username: user.username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        },
        c.env.JWT_SECRET
    )

    setCookie(c, 'admin_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 60 * 60 * 24,
    })

    return c.json({ success: true })
}
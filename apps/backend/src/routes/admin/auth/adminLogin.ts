import bcrypt from "bcryptjs";
import { Context } from "hono";
import { sign } from "hono/jwt";
import { getDB } from "../../../db/db";
import { admin } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import z, { infer } from "zod";

const AdminSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type AdminProps = z.infer<typeof AdminSchema>;

export async function adminLogin(c: Context) {
  const body = await c.req.json();

  console.log(body);

  const { success } = AdminSchema.safeParse(body);

  if (!success) return c.text("Invalid credentials", 401);

  const { username, password } = body;

  const db = getDB(c.env.DB);

  // const hPassword = await bcrypt.hash(password, 10);
  // console.log('Hashed password:', hPassword);

  // await db.insert(admin).values({
  //     username,
  //     password: hPassword
  // })

  const result = await db
    .select()
    .from(admin)
    .where(eq(admin.username, username))
    .limit(1);

  if (!result.length) return c.text("Invalid user", 401);

  const user = result[0];
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) return c.text("Invalid credentials", 401);

  const token = await sign(
    {
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    c.env.JWT_SECRET,
    "HS256",
  );

  setCookie(c, "admin_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return c.json({ success: true });
}

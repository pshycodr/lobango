import { Context } from "hono";

const verifyAdmin = (c: Context) => {
  return c.json({
    success: true,
  });
};

export default verifyAdmin;

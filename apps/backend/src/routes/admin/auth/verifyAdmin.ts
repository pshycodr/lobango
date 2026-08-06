import { HttpStatus } from "@/constants/httpStatusCodes";
import { Context } from "hono";

const verifyAdmin = (c: Context) => {
  return c.json(
    {
      success: true,
    },
    HttpStatus.Ok
  );
};

export default verifyAdmin;

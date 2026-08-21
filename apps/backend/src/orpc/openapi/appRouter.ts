import { adminRouter } from "@/orpc/routers/admin";
import { clientRouter } from "@/orpc/routers/client";
import { paymentRouter } from "@/orpc/routers/payment";

export const openApiRouter = {
  client: clientRouter,
  admin: adminRouter,
  payment: paymentRouter,
};

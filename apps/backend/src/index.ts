import { adminRouter } from "@/orpc/routers/admin";
import { clientRouter } from "@/orpc/routers/client";
import { paymentRouter } from "@/orpc/routers/payment";
import { Bindings } from "@/types/env";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Bindings }>();

const allowedOrigins = [
  "https://adminlobango.vercel.app",
  "https://lobango.vercel.app",
  "https://admin.lobango.in",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return origin;
      return allowedOrigins.includes(origin) ? origin : "";
    },
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (c) => c.text("Hello Hono!"));

const clientHandler = new RPCHandler(clientRouter, {
  interceptors: [onError((err) => console.error(err))],
});

const adminHandler = new RPCHandler(adminRouter, {
  interceptors: [onError((err) => console.error(err))],
});

const paymentHandler = new RPCHandler(paymentRouter, {
  interceptors: [onError((err) => console.error(err))],
});

app.use("/api/v1/client/*", async (c, next) => {
  const { matched, response } = await clientHandler.handle(c.req.raw, {
    prefix: "/api/v1/client",
    context: { env: c.env },
  });
  if (matched) return c.newResponse(response.body, response);
  await next();
});

app.use("/api/v1/admin/*", async (c, next) => {
  const { matched, response } = await adminHandler.handle(c.req.raw, {
    prefix: "/api/v1/admin",
    context: { env: c.env },
  });
  if (matched) return c.newResponse(response.body, response);
  await next();
});

app.use("/api/v1/payment/*", async (c, next) => {
  const { matched, response } = await paymentHandler.handle(c.req.raw, {
    prefix: "/api/v1/payment",
    context: { env: c.env },
  });
  if (matched) return c.newResponse(response.body, response);
  await next();
});

export default app;

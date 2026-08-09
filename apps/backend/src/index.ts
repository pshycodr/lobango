import { openApiRouter } from "@/orpc/openapi/appRouter";
import { adminRouter } from "@/orpc/routers/admin";
import { clientRouter } from "@/orpc/routers/client";
import { paymentRouter } from "@/orpc/routers/payment";
import { createORPCContext } from "@/orpc/context";
import { Bindings } from "@/types/env";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { API_TAG_DEFINITIONS } from "./orpc/openapi/tags";

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
    context: createORPCContext(c.env),
  });
  if (matched) return c.newResponse(response.body, response);
  await next();
});

app.use("/api/v1/admin/*", async (c, next) => {
  const { matched, response } = await adminHandler.handle(c.req.raw, {
    prefix: "/api/v1/admin",
    context: createORPCContext(c.env),
  });
  if (matched) return c.newResponse(response.body, response);
  await next();
});

app.use("/api/v1/payment/*", async (c, next) => {
  const { matched, response } = await paymentHandler.handle(c.req.raw, {
    prefix: "/api/v1/payment",
    context: createORPCContext(c.env),
  });
  if (matched) return c.newResponse(response.body, response);
  await next();
});

const openApiHandler = new OpenAPIHandler(openApiRouter, {
  interceptors: [onError((err) => console.error(err))],
  plugins: [
    new OpenAPIReferencePlugin({
      docsProvider: "scalar",
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: "Lobango API",
          version: "1.0.0",
          description:
            "Public and internal API for Lobango ordering and admin operations.",
        },
        tags: API_TAG_DEFINITIONS,
      },
      docsConfig: {
        theme: "deepSpace",
        layout: "modern",
        hideDownloadButton: false,
      },
      docsPath: "/docs",
      specPath: "/spec.json",
    }),
  ],
});

app.use("/openapi/*", async (c, next) => {
  const { matched, response } = await openApiHandler.handle(c.req.raw, {
    prefix: "/openapi",
    context: createORPCContext(c.env),
  });
  if (matched) return c.newResponse(response.body, response);
  await next();
});

export default app;

import { createORPCContext } from "@/orpc/context";
import { openApiRouter } from "@/orpc/openapi/appRouter";
import { adminRouter } from "@/orpc/routers/admin";
import { clientRouter } from "@/orpc/routers/client";
import { paymentRouter } from "@/orpc/routers/payment";
import { Bindings } from "@/types/env";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { API_TAG_DEFINITIONS } from "./orpc/openapi/tags";
import { EmailQueueMessage } from "./types/queue";
import {
  sendBookingConfirmedEmail,
  sendBookingStatusUpdateEmail,
  sendOrderPlacedEmail,
  sendOrderStatusUpdateEmail,
  sendOtpEmail,
} from "./utils/sendEmail";
import { withCookies } from "./utils/withCookies";

const app = new Hono<{ Bindings: Bindings }>();

const allowedOrigins = [
  "https://adminlobango.vercel.app",
  "https://lobango.vercel.app",
  "https://admin.lobango.in",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173",
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

app.use("/api/v1/client/*", async (context, next) => {
  const { matched, response } = await clientHandler.handle(context.req.raw, {
    prefix: "/api/v1/client",
    context: createORPCContext(context),
  });
  if (matched) return withCookies(context, response);
  await next();
});

app.use("/api/v1/admin/*", async (context, next) => {
  const { matched, response } = await adminHandler.handle(context.req.raw, {
    prefix: "/api/v1/admin",
    context: createORPCContext(context),
  });

  if (matched) {
    context.res.headers.forEach((value, key) => {
      response.headers.append(key, value);
    });
    return withCookies(context, response);
  }

  await next();
});

app.use("/api/v1/payment/*", async (context, next) => {
  const { matched, response } = await paymentHandler.handle(context.req.raw, {
    prefix: "/api/v1/payment",
    context: createORPCContext(context),
  });
  if (matched) return withCookies(context, response);
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

app.use("/openapi/*", async (context, next) => {
  const { matched, response } = await openApiHandler.handle(context.req.raw, {
    prefix: "/openapi",
    context: createORPCContext(context),
  });
  if (matched) return withCookies(context, response);
  await next();
});

export default {
  fetch: app.fetch,

  async queue(batch: MessageBatch<EmailQueueMessage>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        const payload = message.body;

        switch (payload.type) {
          case "order-confirmation":
            await sendOrderPlacedEmail({
              env,
              to: payload.to,
              name: payload.name,
              total: payload.total,
              orderId: payload.orderId,
              customerPhone: payload.customerPhone,
              customerAddress: payload.customerAddress,
            });
            break;

          case "order-status-update":
            await sendOrderStatusUpdateEmail({
              env,
              to: payload.to,
              name: payload.name,
              orderId: payload.orderId,
              status: payload.status,
              reason: payload.reason,
            });
            break;

          case "booking-confirmation":
            await sendBookingConfirmedEmail({
              env,
              to: payload.to,
              customerName: payload.customerName,
              bookingId: payload.bookingId,
              customerPhone: payload.customerPhone,
              customerEmail: payload.customerEmail,
              date: payload.date,
              time: payload.time,
              numberOfPeople: payload.numberOfPeople,
            });
            break;

          case "booking-status-update":
            await sendBookingStatusUpdateEmail({
              env,
              to: payload.to,
              customerName: payload.customerName,
              bookingId: payload.bookingId,
              status: payload.status,
              date: payload.date,
              time: payload.time,
              reason: payload.reason,
            });
            break;

          case "otp":
            await sendOtpEmail({
              env,
              to: payload.to,
              name: payload.name,
              otp: payload.otp,
              expiresInMinutes: payload.expiresInMinutes,
            });
            break;

          default: {
            const _exhaustive: never = payload;
            console.warn("Unhandled email queue message", _exhaustive);
          }
        }

        message.ack();
      } catch (err) {
        console.error("Failed to process email", {
          error: err,
          body: message.body,
        });
        message.retry();
      }
    }
  },
};

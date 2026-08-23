import { createKVClient, type KVClient } from "@/lib/kv";
import { createQueueClient, type QueueClient } from "@/lib/queue";
import type { Bindings } from "@/types/env";
import { Context } from "hono";

export type ORPCContext = {
  env: Bindings;
  cache: KVClient;
  queues: QueueClient;
  hono: Context;
  ip: string;
};

export function createORPCContext(context: Context): ORPCContext {
  return {
    env: context.env,
    cache: createKVClient(context.env.KV),
    queues: createQueueClient(context.env),
    hono: context,
    ip: getClientIp(context),
  };
}

function getClientIp(c: Context): string {
  return (
    c.req.header("CF-Connecting-IP") ??
    // fallback chain — first entry of X-Forwarded-For, if it ever ends up here
    c.req.header("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

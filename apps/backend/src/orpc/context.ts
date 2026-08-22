import { createKVClient, type KVClient } from "@/lib/kv";
import { createQueueClient, type QueueClient } from "@/lib/queue";
import type { Bindings } from "@/types/env";
import { Context } from "hono";

export type ORPCContext = {
  env: Bindings;
  cache: KVClient;
  queues: QueueClient;
  hono: Context;
};

export function createORPCContext(context: Context): ORPCContext {
  return {
    env: context.env,
    cache: createKVClient(context.env.KV),
    queues: createQueueClient(context.env),
    hono: context,
  };
}

import type { Bindings } from "@/types/env";
import { createKVClient, type KVClient } from "@/utils/kv";
import { Context } from "hono";

export type ORPCContext = {
  env: Bindings;
  cache: KVClient;
  hono: Context;
};

export function createORPCContext(context: Context): ORPCContext {
  return {
    env: context.env,
    cache: createKVClient(context.env.KV),
    hono: context,
  };
}

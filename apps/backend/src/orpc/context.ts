import type { Bindings } from "@/types/env";
import { createKVClient, type KVClient } from "@/utils/kv";

export type ORPCContext = {
  env: Bindings;
  cache: KVClient;
};

export function createORPCContext(env: Bindings): ORPCContext {
  return {
    env,
    cache: createKVClient(env.KV),
  };
}

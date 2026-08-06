import type { Context } from "hono";
import type { Bindings } from "./env";

export type AppContext = Context<{
  Bindings: Bindings;
}>;

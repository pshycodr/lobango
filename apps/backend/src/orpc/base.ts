import { os } from "@orpc/server";
import type { ORPCContext } from "./context";

export const orpc = os.$context<ORPCContext>();

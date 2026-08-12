import { adminAuthMiddleware } from "@/middleware/adminAuth";
import { os } from "@orpc/server";
import type { ORPCContext } from "./context";

export const orpc = os.$context<ORPCContext>();
export const adminOrpc = orpc.use(adminAuthMiddleware);

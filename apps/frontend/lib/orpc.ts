import type { ClientRouter } from "@lobango/backend/rpc/client";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8787";

const link = new RPCLink({
  url: `${BASE_URL}/api/v1/client`,
  fetch: (url, options) => fetch(url, { ...options, credentials: "include" }),
});

export const client: RouterClient<ClientRouter> = createORPCClient(link);

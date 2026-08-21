import type { AdminRouter } from "@lobango/backend/rpc/admin";
import type { ClientRouter } from "@lobango/backend/rpc/client";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";

declare const process: {
  env?: {
    BACKEND_URL?: string;
    [key: string]: string | undefined;
  };
};

const BASE_URL =
  (typeof process !== "undefined" ? process.env?.BACKEND_URL : undefined) ||
  import.meta.env?.VITE_BACKEND_URL ||
  "http://localhost:8787";

const adminLink = new RPCLink({
  url: `${BASE_URL}/api/v1/admin`,
  fetch: (url, options) => fetch(url, { ...options, credentials: "include" }),
});

const clientLink = new RPCLink({
  url: `${BASE_URL}/api/v1/client`,
  fetch: (url, options) => fetch(url, { ...options, credentials: "include" }),
});

export const admin: RouterClient<AdminRouter> = createORPCClient(adminLink);
export const client: RouterClient<ClientRouter> = createORPCClient(clientLink);

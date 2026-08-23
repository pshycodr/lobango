import { OtpPurpose } from "@lobango/contracts/otp";

async function setKV<T>(
  kv: KVNamespace,
  key: string,
  value: T,
  ttlSeconds?: number
): Promise<void> {
  const serialized = typeof value === "string" ? value : JSON.stringify(value);

  if (ttlSeconds !== undefined && ttlSeconds < 60) {
    throw new Error(
      `KV expirationTtl must be at least 60 seconds (got ${ttlSeconds})`
    );
  }

  await kv.put(key, serialized, {
    ...(ttlSeconds !== undefined && { expirationTtl: ttlSeconds }),
  });
}

async function getKV<T>(kv: KVNamespace, key: string): Promise<T | null> {
  const raw = await kv.get(key, { type: "text" });
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

async function deleteKV(kv: KVNamespace, key: string): Promise<void> {
  await kv.delete(key);
}

const kvKeys = {
  orderCache: (orderId: string) => `order-cache:${orderId}`,
  bookingCache: (bookingId: string) => `booking-cache:${bookingId}`,
  orderStatus: (orderId: string) => `order-status:${orderId}`,

  otpKey: (purpose: OtpPurpose, email: string, resourceId?: string) =>
    `otp:${purpose}:${email.toLowerCase().trim()}
     ${resourceId ? `:${resourceId}` : ""}`,
  otpActionKey: (actionToken: string) => `otp-action:${actionToken}`,

  admin: {
    ordersVersion: () => "admin:orders:version",
    bookingVersion: () => "admin:bookings:version",
    orders: (
      version: number | null,
      params?: {
        date?: string;
        from?: string;
        to?: string;
      }
    ) => {
      const query = new URLSearchParams();

      if (params?.date) query.set("date", params.date);
      if (params?.from) query.set("from", params.from);
      if (params?.to) query.set("to", params.to);

      return `admin:orders:v${version}:${query.toString() || "all"}`;
    },

    bookings: (
      version: number | null,
      params?: {
        date?: string;
        from?: string;
        to?: string;
      }
    ) => {
      const query = new URLSearchParams();

      if (params?.date) query.set("date", params.date);
      if (params?.from) query.set("from", params.from);
      if (params?.to) query.set("to", params.to);

      return `admin:bookings:v${version}:${query.toString() || "all"}`;
    },
  },

  orderPermission: () => "permission:new_order",
  bookingPermission: () => "permission:new_booking",
} as const;

export function createKVClient(kv: KVNamespace) {
  return {
    set: <T>(key: string, value: T, ttlSeconds?: number) =>
      setKV(kv, key, value, ttlSeconds),

    get: <T>(key: string) => getKV<T>(kv, key),

    delete: (key: string) => deleteKV(kv, key),

    invalidate: async (...keys: string[]) => {
      await Promise.all(keys.map((key) => deleteKV(kv, key)));
    },

    invalidateVersion: async (key: string) => {
      const current = (await getKV<number>(kv, key)) ?? 1;
      await setKV(kv, key, current + 1);
    },

    getKey: kvKeys,
  };
}

export type KVClient = ReturnType<typeof createKVClient>;

export async function setKV<T>(
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

export async function getKV<T>(
  kv: KVNamespace,
  key: string
): Promise<T | null> {
  const raw = await kv.get(key, { type: "text" });
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

export async function deleteKV(kv: KVNamespace, key: string): Promise<void> {
  await kv.delete(key);
}

export const kvKeys = {
  orderCache: (orderId: string) => `order-cache:${orderId}`,
  bookingCache: (bookingId: string) => `booking-cache:${bookingId}`,
  orderStatus: (orderId: string) => `order-status:${orderId}`,
  orderPermission: () => `permission:new_order`,
  bookingPermission: () => `permission:new_booking`,
} as const;

export function createKVClient(kv: KVNamespace) {
  return {
    set: <T>(key: string, value: T, ttlSeconds?: number) =>
      setKV(kv, key, value, ttlSeconds),
    get: <T>(key: string) => getKV<T>(kv, key),
    delete: (key: string) => deleteKV(kv, key),
    getKey: kvKeys,
  };
}

export type KVClient = ReturnType<typeof createKVClient>;

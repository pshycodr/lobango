import { getDB } from "@/db/db";
import { orders } from "@/db/schema";
import type { ORPCContext } from "@/orpc/context";
import { OtpPurpose } from "@lobango/contracts/otp";
import { eq } from "drizzle-orm";

type OwnershipCheck = (
  context: ORPCContext,
  email: string,
  resourceId: string
) => Promise<boolean>;

export const OTP_OWNERSHIP_CHECKS: Record<OtpPurpose, OwnershipCheck> = {
  cancel_order: async (context, email, resourceId) => {
    const db = getDB(context.env.DB);
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderId, resourceId));
    return Boolean(
      order && order.customerEmail.toLowerCase() === email.toLowerCase()
    );
  },

  new_booking: async () => {
    // no existing resource to own yet, creating a booking just requires a valid email
    return true;
  },
};

/**
 * Generates a cryptographically secure 6-digit OTP using the Workers runtime's
 * Web Crypto API (not Math.random, which is not cryptographically secure).
 */
export function generateOtp(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  // modulo bias is negligible here (2^32 / 1_000_000 is effectively uniform)
  return String(buf[0] % 1_000_000).padStart(6, "0");
}

/**
 * Hashes an OTP with SHA-256 using the Web Crypto API (crypto.subtle),
 * the standard, non-Node-dependent way to hash on Cloudflare Workers.
 * Returns a hex string, safe to store in KV instead of the plaintext OTP.
 */
export async function hashOtp(otp: string): Promise<string> {
  const data = new TextEncoder().encode(otp);
  const digestBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(digestBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

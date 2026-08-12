import { SignatureAlgorithm } from "hono/utils/jwt/jwa";

export type Bindings = {
  DB: D1Database;
  KV: KVNamespace;

  JWT_SECRET: string;
  JWT_SINATURE_ALGO: SignatureAlgorithm;

  RAZORPAY_KEY_ID: string;
  RAZORPAY_SECRET_KEY: string;

  BREVO_API_KEY: string;
  BREVO_SENDER_EMAIL: string;
  BREVO_SENDER_NAME: string;
  BREVO_SMTP_API_KEY: string;

  ORDER_CACHE_TTL: number;
  BOOKING_CACHE_TTL: number;
  ORDER_STATUS_CACHE_TTL: number;
  ADMIN_AUTH_TOKEN_TTL: number;

  ADMIN_AUTH_COOKIE_KEY: string;
};

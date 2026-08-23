import { SignatureAlgorithm } from "hono/utils/jwt/jwa";
import { EmailQueueMessage } from "./queue";

export type Bindings = {
  DB: D1Database;
  KV: KVNamespace;

  EMAIL_QUEUE: Queue<EmailQueueMessage>;

  JWT_SECRET: string;
  JWT_SINATURE_ALGO: SignatureAlgorithm;

  RAZORPAY_KEY_ID: string;
  RAZORPAY_SECRET_KEY: string;

  BREVO_API_KEY: string;
  BREVO_SENDER_EMAIL: string;
  BREVO_SENDER_NAME: string;

  ORDER_CACHE_TTL: number;
  BOOKING_CACHE_TTL: number;
  ORDER_STATUS_CACHE_TTL: number;
  ADMIN_AUTH_TOKEN_TTL: number;
  ADMIN_ORDERS_CACHE_TTL: number;
  ADMIN_BOOKING_CACHE_TTL: number;

  OTP_TTL: number;
  OTP_ACTION_TOEKN_TTL: number;
  OTP_MAX_ATTEMPTS: number;

  ADMIN_AUTH_COOKIE_KEY: string;
};

export type Bindings = {
  DB: D1Database;
  KV: KVNamespace;

  JWT_SECRET: string;

  RAZORPAY_KEY_ID: string;
  RAZORPAY_SECRET_KEY: string;

  BREVO_API_KEY: string;
  BREVO_SENDER_EMAIL: string;
  BREVO_SENDER_NAME: string;
  BREVO_SMTP_API_KEY: string;

  ORDER_CACHE_TTL: number;
  BOOKING_CACHE_TTL: number;
};

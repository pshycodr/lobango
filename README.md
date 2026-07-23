# Lobango

A full-stack restaurant ordering & table-reservation platform, built as a monorepo with three cooperating apps: a customer web app, a staff admin panel, and a shared serverless API.

## What it does

- **Customers** browse the menu, order food for delivery with online payment, track their order, and book a table — all from the web.
- **Staff/admin** manage incoming orders and bookings, accept or reject reservations, and export customer data — from a mobile-first dashboard that also builds as a native Android app.
- **Restaurant owner** can flip a single switch to pause new orders or bookings (e.g., during off-hours or a fully booked evening) without touching code.

## Tech stack

| Layer               | Tech                                                               |
| ------------------- | ------------------------------------------------------------------ |
| Backend API         | [Hono](https://hono.dev/) on **Cloudflare Workers**                |
| Database            | **Cloudflare D1** via **Drizzle ORM**                              |
| Customer web app    | **Next.js 15** + React 19                                          |
| Admin app           | **React 19 + Vite**, wrapped in **Capacitor** for Android          |
| Payments            | **Razorpay** (order creation + server-side signature verification) |
| Email notifications | **Brevo**                                                          |
| Auth                | JWT (cookie-based) + bcrypt                                        |
| State management    | Zustand                                                            |
| Styling             | Tailwind CSS                                                       |
| Package manager     | Bun                                                                |

## Monorepo structure

```
lobango/
├── backend/     Hono API deployed to Cloudflare Workers
├── frontend/    Next.js customer-facing app (menu, cart, checkout, tracking, bookings)
└── admin/       React + Vite admin dashboard (also ships as an Android app via Capacitor)
```

## Key engineering details

- **Anti-tampering checkout**: item prices are recalculated server-side from the menu at checkout time rather than trusted from the client.
- **Payment integrity**: Razorpay payments are verified with an HMAC-SHA256 signature check on the backend, not just trusted from the frontend.
- **Feature toggles**: a lightweight single-row "permissions" table lets the admin instantly pause new orders or new bookings platform-wide.
- **Near-real-time admin sync**: the admin dashboard polls for new orders/bookings on a 60-second interval.

## Getting started (local development)

```bash
# 1. Backend (Cloudflare Workers via Wrangler)
cd backend
bun install
cp wrangler.jsonc.example wrangler.jsonc   # fill in your own Cloudflare D1, Razorpay, and Brevo credentials
bun run dev

# 2. Customer frontend (Next.js)
cd frontend
bun install
bun run dev

# 3. Admin panel (Vite)
cd admin
bun install
bun run dev
```

Each app can also be deployed independently: the backend to Cloudflare Workers (`bun run deploy`), and the frontend/admin to Vercel. The admin app can additionally be built for Android via Capacitor.

## Status

Actively built as a solo project over ~1 month; not currently under active development. No automated tests or CI pipeline yet — contributions/PRs welcome.

## License

No license file is currently included in this repository.

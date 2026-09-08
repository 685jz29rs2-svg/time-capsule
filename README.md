# 약속 — Digital Time Capsule

Digital time-capsule captures and seals the present moment, delivering it at a time chosen by the user. It becomes a promise, a letter, and a gift. The words we leave behind today await tomorrow, much like a seed in the ground.

This is a Next.js App Router rebuild of the morning product (Cursor Origin `jihyun-kim/tmp-a82830ef05c979dc` was not readable from this agent). Header **약속**, watercolor empty state, Stripe **$2** seal, Supabase, Resend, hourly cron, and **DEMO_MODE**.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

`DEMO_MODE=true` (default in `.env.example`) skips Stripe charges. The composer still seals a capsule so Vercel Import works before secrets are added.

## Production env (Vercel)

| Variable | Purpose |
| --- | --- |
| `DEMO_MODE` | `true` until Stripe is ready; set `false` to charge $2 |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL for email links |
| `STRIPE_SECRET_KEY` | Checkout for the $2 seal |
| `STRIPE_WEBHOOK_SECRET` | `POST /api/webhooks/stripe` |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Persist capsules (run `supabase/migrations/001_capsules.sql`) |
| `RESEND_API_KEY` / `RESEND_FROM` | Delivery mail when the open date arrives |
| `CRON_SECRET` | Bearer token for `GET /api/cron/deliver` |
| `CAPSULE_SIGNING_SECRET` | Signs demo tokens |

Vercel Cron (`vercel.json`) calls `/api/cron/deliver` hourly. Configure the same path as a Stripe webhook endpoint after deploy.

## Flow

1. Write a letter. The watercolor empty state shows until the first word.
2. Choose who receives it and when it may open.
3. Seal for $2 (or instantly in DEMO_MODE).
4. Cron + Resend deliver the open link at the appointed time.

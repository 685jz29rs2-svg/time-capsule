# 약속 — Digital Time Capsule

Digital time-capsule captures and seals the present moment, delivering it at a time chosen by the user. It becomes a promise, a letter, and a gift.

Korean is the default. English is a full equal UI at **`/en`** (cookie `yak-locale` is set when you switch).

## Morning parity

Origin `jihyun-kim/tmp-a82830ef05c979dc` @ `~4bbf040` was not readable from this agent. The live morning demo [https://temporary-flying-tungsten-2egg27p.vercel.app](https://temporary-flying-tungsten-2egg27p.vercel.app) was scraped (HTML, CSS tokens, `/new` form JS, `watercolor-pine.png`) and rebuilt to that UX:

| Route | Role |
| --- | --- |
| `/` · `/en` | Landing — header **약속** / **Promise**, pine mark, CTA |
| `/new` · `/en/new` | Compose — watercolor empty handwriting, empty 년/월/일/시/분 (Asia/Seoul, min +10m), USD $2.00 |
| `/new/success` | After Stripe return (or demo token) |
| `/capsules` | Local list — **unlock time only**, never the body |
| `/c/:id` | Token open link. Bad / unpaid id → 404-like |

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

`DEMO_MODE=true` virtual-seals for $2.00 with no charge.

## Production env (Vercel)

| Variable | Purpose |
| --- | --- |
| `DEMO_MODE` | `true`/`1` virtual seal. `false`/`0` (or unset) is live. **Missing Stripe keys do not fall back to demo.** |
| `APP_URL` / `NEXT_PUBLIC_APP_URL` | Stripe success/cancel + email links |
| `STRIPE_SECRET_KEY` | Checkout USD **$2.00** (`SEAL_PRICE_CENTS=200`) |
| `STRIPE_WEBHOOK_SECRET` | `POST /api/webhooks/stripe` — `checkout.session.completed` → `sealed` |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Persist capsules (`supabase/migrations`) |
| `RESEND_API_KEY` / `RESEND_FROM` | Delivery mail to `/c/:id` |
| `CRON_SECRET` | Bearer for `GET /api/cron/deliver` |
| `CAPSULE_SIGNING_SECRET` | Signs fallback tokens |

Flow: create → status `pending_payment` → Stripe Checkout $2.00 → webhook seals. Cancel/fail stays unsealed; same draft can retry.

## Leftover (consoles — out of scope here)

1. Create Stripe product/webhook endpoint `https://<APP_URL>/api/webhooks/stripe` (`checkout.session.completed`).
2. Set `DEMO_MODE=false` plus live/test Stripe keys on Vercel (project: time-capsule.vercel.app).
3. Run both SQL migrations on Supabase.
4. Add Resend from-domain and `RESEND_FROM`.
5. Confirm Vercel Cron hits `/api/cron/deliver` hourly.
6. Point the production domain and `APP_URL` at that deployment.

`npm run build` must pass before deploy.

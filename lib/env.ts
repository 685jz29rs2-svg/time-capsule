export const SEAL_PRICE_CENTS = 200;
export const SEAL_CURRENCY = "usd";
export const SEAL_LABEL = "Time capsule seal";

function rawDemoFlag(): string | undefined {
  return process.env.DEMO_MODE ?? process.env.NEXT_PUBLIC_DEMO_MODE;
}

/** true|1 = virtual seal. false|0 or unset = live (never infer demo from missing keys). */
export function isDemoMode(): boolean {
  const flag = rawDemoFlag();
  return flag === "true" || flag === "1";
}

export function isLiveMode(): boolean {
  return !isDemoMode();
}

export function hasStripe(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function assertLiveStripeConfigured(): void {
  if (isDemoMode()) return;
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "DEMO_MODE=false but STRIPE_SECRET_KEY is missing. Refusing silent demo.",
    );
  }
}

export function appUrl(): string {
  const explicit = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function signingSecret(): string {
  return process.env.CAPSULE_SIGNING_SECRET || "demo-signing-secret-not-for-production";
}

export function hasSupabase(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasResend(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

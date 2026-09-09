import { NextResponse } from "next/server";
import { hasResend, hasStripe, hasSupabase, isDemoMode, SEAL_CURRENCY, SEAL_PRICE_CENTS } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    demo: isDemoMode(),
    stripe: hasStripe(),
    supabase: hasSupabase(),
    resend: hasResend(),
    seal: { currency: SEAL_CURRENCY, unit_amount: SEAL_PRICE_CENTS },
  });
}

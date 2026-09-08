import { NextResponse } from "next/server";
import { hasResend, hasStripe, hasSupabase, isDemoMode } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    demo: isDemoMode(),
    stripe: hasStripe(),
    supabase: hasSupabase(),
    resend: hasResend(),
  });
}

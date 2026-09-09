import { NextResponse } from "next/server";
import { getCapsuleByToken, isSealed } from "@/lib/capsules";
import { startCheckout } from "@/lib/checkout";
import { isDemoMode } from "@/lib/env";
import { localeFromRequest } from "@/lib/validate";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const data = (json ?? {}) as Record<string, unknown>;
  const draftId = String(data.draftId ?? data.token ?? "");
  if (!draftId) {
    return NextResponse.json({ error: "draftId required" }, { status: 400 });
  }

  const existing = await getCapsuleByToken(draftId);
  if (!existing || isSealed(existing)) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  }

  const locale = data.locale === "en" || data.locale === "ko" ? data.locale : localeFromRequest(request);

  try {
    const result = await startCheckout(
      {
        senderName: existing.senderName,
        recipientEmail: existing.recipientEmail,
        body: existing.body,
        openAt: existing.openAt,
      },
      locale,
      existing,
    );
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    const liveFail = !isDemoMode() && /STRIPE_SECRET_KEY|silent demo/i.test(message);
    return NextResponse.json({ error: message }, { status: liveFail ? 500 : 400 });
  }
}

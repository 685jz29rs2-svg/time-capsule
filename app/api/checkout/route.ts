import { NextResponse } from "next/server";
import { startCheckout } from "@/lib/checkout";
import { isDemoMode } from "@/lib/env";
import { localeFromRequest, validateDraft } from "@/lib/validate";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!json || typeof json !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const locale = localeFromRequest(request);
  const data = json as Record<string, unknown>;
  if (data.locale === "en" || data.locale === "ko") {
    /* prefer explicit body locale */
  }
  const chosen = data.locale === "en" || data.locale === "ko" ? data.locale : locale;
  const parsed = validateDraft(data, chosen);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: Object.values(parsed.errors)[0], errors: parsed.errors },
      { status: 400 },
    );
  }

  try {
    const result = await startCheckout(parsed.draft, chosen);
    return NextResponse.json({
      ...result,
      url: result.demo ? undefined : result.url,
      demo: result.demo,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    const liveFail = !isDemoMode() && /STRIPE_SECRET_KEY|silent demo/i.test(message);
    return NextResponse.json({ error: message }, { status: liveFail ? 500 : 400 });
  }
}

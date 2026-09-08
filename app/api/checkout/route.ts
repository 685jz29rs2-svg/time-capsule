import { NextResponse } from "next/server";
import { appUrl, hasStripe, isDemoMode, SEAL_CURRENCY, SEAL_LABEL, SEAL_PRICE_CENTS } from "@/lib/env";
import { createDraft, saveCapsule, sealCapsule } from "@/lib/capsules";
import { getStripe } from "@/lib/stripe";
import type { CapsuleDraft } from "@/lib/types";

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function parseDraft(body: unknown): CapsuleDraft | string {
  if (!body || typeof body !== "object") return "Invalid JSON";
  const data = body as Record<string, unknown>;
  const senderName = String(data.senderName ?? "").slice(0, 80);
  const recipientEmail = String(data.recipientEmail ?? "").trim();
  const letter = String(data.body ?? "");
  const openAt = String(data.openAt ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    return "받는 이 이메일을 확인해 주세요.";
  }
  if (!letter.trim()) return "아직 적힌 말이 없어요.";
  if (letter.length > 8000) return "편지가 너무 깁니다.";
  const when = new Date(openAt);
  if (Number.isNaN(when.getTime())) return "열어볼 날을 선택해 주세요.";
  if (when.getTime() < Date.now() - 60_000) return "열어볼 날은 지금 이후여야 합니다.";
  return { senderName, recipientEmail, body: letter, openAt: when.toISOString() };
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return bad("Invalid JSON");
  }

  const parsed = parseDraft(json);
  if (typeof parsed === "string") return bad(parsed);

  let capsule = createDraft(parsed);

  if (isDemoMode() || !hasStripe()) {
    capsule = sealCapsule(capsule, "demo");
    await saveCapsule(capsule);
    return NextResponse.json({
      demo: true,
      id: capsule.id,
      token: capsule.token,
      url: `${appUrl()}/sealed?token=${encodeURIComponent(capsule.token)}`,
    });
  }

  await saveCapsule(capsule);
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${appUrl()}/sealed?token=${encodeURIComponent(capsule.token)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl()}/?canceled=1`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: SEAL_CURRENCY,
          unit_amount: SEAL_PRICE_CENTS,
          product_data: {
            name: SEAL_LABEL,
            description: "Seal a promise until the day you chose.",
          },
        },
      },
    ],
    customer_email: capsule.recipientEmail,
    metadata: {
      capsuleId: capsule.id,
      token: capsule.token,
    },
  });

  capsule = { ...capsule, stripeSessionId: session.id };
  await saveCapsule(capsule);

  return NextResponse.json({
    demo: false,
    id: capsule.id,
    token: capsule.token,
    url: session.url,
  });
}

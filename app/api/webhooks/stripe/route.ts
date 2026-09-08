import { NextResponse } from "next/server";
import { getCapsuleByStripeSession, getCapsuleByToken, saveCapsule, sealCapsule } from "@/lib/capsules";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET missing" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const raw = await request.text();
  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const token = session.metadata?.token;
    const existing =
      (token ? await getCapsuleByToken(token) : null) ??
      (session.id ? await getCapsuleByStripeSession(session.id) : null);
    if (existing && existing.status === "draft") {
      await saveCapsule(sealCapsule(existing, session.id));
    }
  }

  return NextResponse.json({ received: true });
}

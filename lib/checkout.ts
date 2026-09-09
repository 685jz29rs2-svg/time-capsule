import {
  appUrl,
  assertLiveStripeConfigured,
  hasStripe,
  isDemoMode,
  SEAL_CURRENCY,
  SEAL_LABEL,
  SEAL_PRICE_CENTS,
} from "@/lib/env";
import { createDraft, saveCapsule, sealCapsule } from "@/lib/capsules";
import { getStripe } from "@/lib/stripe";
import type { Capsule, CapsuleDraft } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";

export async function startCheckout(
  draft: CapsuleDraft,
  locale: Locale,
  existing?: Capsule | null,
): Promise<{ url: string; token: string; demo: boolean; openAt: string }> {
  if (isDemoMode()) {
    let capsule = existing ?? createDraft(draft, "sealed");
    capsule = sealCapsule({ ...capsule, ...normalizeDraft(capsule, draft) }, "demo");
    await saveCapsule(capsule);
    return {
      url: localizedPath(locale, `/new/success?token=${encodeURIComponent(capsule.token)}&demo=1`),
      token: capsule.token,
      demo: true,
      openAt: capsule.openAt,
    };
  }

  assertLiveStripeConfigured();
  if (!hasStripe()) {
    throw new Error("DEMO_MODE=false but STRIPE_SECRET_KEY is missing. Refusing silent demo.");
  }

  let capsule = existing ?? createDraft(draft, "pending_payment");
  if (existing) {
    capsule = {
      ...existing,
      ...normalizeDraft(existing, draft),
      status: "pending_payment",
      sealedAt: null,
    };
  }
  await saveCapsule(capsule);

  const stripe = getStripe();
  const origin = appUrl();
  const success = `${origin}${localizedPath(locale, "/new/success")}?session_id={CHECKOUT_SESSION_ID}&token=${encodeURIComponent(capsule.token)}`;
  const cancel = `${origin}${localizedPath(locale, "/new")}?canceled=1&draft=${encodeURIComponent(capsule.token)}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: success,
    cancel_url: cancel,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: SEAL_CURRENCY,
          unit_amount: SEAL_PRICE_CENTS,
          product_data: {
            name: SEAL_LABEL,
            description: "USD $2.00 seal — promise until the chosen day.",
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

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  capsule = { ...capsule, stripeSessionId: session.id, status: "pending_payment" };
  await saveCapsule(capsule);

  return {
    url: session.url,
    token: capsule.token,
    demo: false,
    openAt: capsule.openAt,
  };
}

function normalizeDraft(capsule: Capsule, draft: CapsuleDraft): Capsule {
  return {
    ...capsule,
    senderName: (draft.senderName ?? capsule.senderName).trim(),
    recipientEmail: draft.recipientEmail.trim().toLowerCase() || capsule.recipientEmail,
    body: draft.body.trim() || capsule.body,
    openAt: draft.openAt ? new Date(draft.openAt).toISOString() : capsule.openAt,
  };
}

import { Resend } from "resend";
import { appUrl, hasResend, isDemoMode } from "@/lib/env";
import { getMessages } from "@/lib/i18n";
import { formatSeoul } from "@/lib/seoul";
import type { Capsule } from "@/lib/types";

let cached: Resend | null = null;

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Resend is not configured");
  if (!cached) cached = new Resend(key);
  return cached;
}

function fromAddress(): string {
  return process.env.RESEND_FROM || "약속 <noreply@example.com>";
}

export function deliveryEmail(capsule: Capsule, locale: "ko" | "en" = "ko"): { subject: string; html: string } {
  const t = getMessages(locale);
  const openHref = `${appUrl()}/c/${capsule.token}`;
  const when = formatSeoul(capsule.openAt, locale);
  return {
    subject: `${t.email.subject} — ${when}`,
    html: `
      <div style="font-family: Georgia, 'Noto Serif KR', serif; color:#2a2118; background:#f4ead8; padding:32px;">
        <p style="letter-spacing:.3em; font-size:12px; color:#2f5c38;">${t.brand.header}</p>
        <h1 style="font-weight:500; font-size:28px;">${t.email.heading}</h1>
        <p>${t.email.intro}</p>
        <p>${when}</p>
        <p><a href="${openHref}" style="color:#2f5c38;">${t.email.cta}</a></p>
      </div>
    `,
  };
}

export async function sendDeliveryEmail(capsule: Capsule): Promise<{ sent: boolean; skipped?: string }> {
  if (!hasResend() || (isDemoMode() && process.env.DEMO_SEND_EMAIL !== "true")) {
    console.info("[resend:demo]", {
      to: capsule.recipientEmail,
      ...deliveryEmail(capsule),
    });
    return { sent: false, skipped: isDemoMode() ? "DEMO_MODE" : "RESEND_API_KEY missing" };
  }

  const { subject, html } = deliveryEmail(capsule);
  await getResend().emails.send({
    from: fromAddress(),
    to: capsule.recipientEmail,
    subject,
    html,
  });
  return { sent: true };
}

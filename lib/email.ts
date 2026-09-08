import { Resend } from "resend";
import { appUrl, hasResend, isDemoMode } from "@/lib/env";
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

export function deliveryEmail(capsule: Capsule): { subject: string; html: string } {
  const openHref = `${appUrl()}/open/${capsule.token}`;
  const when = new Date(capsule.openAt).toLocaleString("ko-KR", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const from = capsule.senderName.trim() || "누군가";
  return {
    subject: `약속이 열렸습니다 — ${from}`,
    html: `
      <div style="font-family: Georgia, 'Noto Serif KR', serif; color:#3b2a22; background:#f7f1e8; padding:32px;">
        <p style="letter-spacing:.3em; font-size:12px; color:#8a6a58;">약 속</p>
        <h1 style="font-weight:500; font-size:28px;">봉인이 풀렸습니다</h1>
        <p>${from}님이 ${when}을 위해 남긴 말이 도착했습니다.</p>
        <p><a href="${openHref}" style="color:#7a2e2e;">캡슐 열기</a></p>
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

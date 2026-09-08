import { NextResponse } from "next/server";
import { listDueCapsules, saveCapsule } from "@/lib/capsules";
import { sendDeliveryEmail } from "@/lib/email";
import { isDemoMode } from "@/lib/env";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const due = await listDueCapsules();
  const results: Array<{ id: string; sent: boolean; skipped?: string }> = [];

  for (const capsule of due) {
    const result = await sendDeliveryEmail(capsule);
    if (result.sent || result.skipped === "DEMO_MODE") {
      await saveCapsule({
        ...capsule,
        status: "delivered",
        deliveredAt: new Date().toISOString(),
      });
    }
    results.push({ id: capsule.id, ...result });
  }

  return NextResponse.json({
    ok: true,
    demo: isDemoMode(),
    delivered: results.length,
    results,
  });
}

export const POST = GET;

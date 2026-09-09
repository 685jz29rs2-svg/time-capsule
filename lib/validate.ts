import { getMessages, type Locale } from "@/lib/i18n";
import { MIN_UNLOCK_MS, seoulWallTimeToUtcMs, type UnlockParts } from "@/lib/seoul";
import type { CapsuleDraft } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = {
  email?: string;
  body?: string;
  unlockAt?: string;
};

export function parseUnlockParts(data: Record<string, unknown>): UnlockParts {
  return {
    year: String(data.unlockYear ?? data.year ?? ""),
    month: String(data.unlockMonth ?? data.month ?? ""),
    day: String(data.unlockDay ?? data.day ?? ""),
    hour: String(data.unlockHour ?? data.hour ?? ""),
    minute: String(data.unlockMinute ?? data.minute ?? ""),
  };
}

export function validateDraft(
  data: Record<string, unknown>,
  locale: Locale,
): { ok: true; draft: CapsuleDraft; unlockMs: number } | { ok: false; errors: FieldErrors } {
  const t = getMessages(locale);
  const errors: FieldErrors = {};
  const email = String(data.email ?? data.recipientEmail ?? "").trim();
  const body = String(data.body ?? "");
  const parts = parseUnlockParts(data);

  if (!email) errors.email = t.errors.emailRequired;
  else if (!EMAIL_RE.test(email)) errors.email = t.errors.emailInvalid;

  const trimmed = body.trim();
  if (!trimmed) errors.body = t.errors.bodyRequired;
  else if (trimmed.length > 4000) errors.body = t.errors.bodyTooLong;

  if ([parts.year, parts.month, parts.day, parts.hour, parts.minute].some((v) => !v.trim())) {
    errors.unlockAt = t.errors.unlockRequired;
  } else {
    const unlockMs = seoulWallTimeToUtcMs(parts);
    if (unlockMs === null) errors.unlockAt = t.errors.unlockInvalid;
    else if (unlockMs < Date.now() + MIN_UNLOCK_MS) errors.unlockAt = t.errors.unlockSoon;
  }

  if (errors.email || errors.body || errors.unlockAt) {
    return { ok: false, errors };
  }

  const unlockMs = seoulWallTimeToUtcMs(parts)!;
  return {
    ok: true,
    unlockMs,
    draft: {
      senderName: String(data.senderName ?? ""),
      recipientEmail: email,
      body: trimmed,
      openAt: new Date(unlockMs).toISOString(),
    },
  };
}

export function localeFromRequest(request: Request): Locale {
  const header = request.headers.get("x-yak-locale");
  if (header === "en" || header === "ko") return header;
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("locale");
    if (q === "en" || q === "ko") return q;
  } catch {
    /* ignore */
  }
  return "ko";
}

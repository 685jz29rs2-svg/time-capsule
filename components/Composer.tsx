"use client";

import { FormEvent, useMemo, useState } from "react";
import { WatercolorEmptyState } from "@/components/WatercolorEmptyState";

const PRESETS = [
  { label: "내일", days: 1 },
  { label: "한 달", days: 30 },
  { label: "일 년", days: 365 },
] as const;

function toLocalInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(9, 0, 0, 0);
  return toLocalInput(date);
}

type ComposerProps = {
  demo: boolean;
  canceled?: boolean;
};

export function Composer({ demo, canceled = false }: ComposerProps) {
  const [senderName, setSenderName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [body, setBody] = useState("");
  const [openAt, setOpenAt] = useState(() => addDays(365));
  const [error, setError] = useState<string | null>(canceled ? "봉인이 취소되었습니다." : null);
  const [pending, setPending] = useState(false);

  const empty = body.trim().length === 0;
  const minOpen = useMemo(() => toLocalInput(new Date()), []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ senderName, recipientEmail, body, openAt }),
      });
      const data = (await response.json()) as {
        url?: string;
        token?: string;
        error?: string;
      };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "봉인에 실패했습니다.");
      }
      if (data.token) {
        window.localStorage.setItem(
          `capsule:${data.token}`,
          JSON.stringify({ senderName, recipientEmail, body, openAt, token: data.token }),
        );
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "봉인에 실패했습니다.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="paper-card rounded-[28px] p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs tracking-wide text-ink-soft">
          보내는 이
          <input
            name="senderName"
            value={senderName}
            onChange={(event) => setSenderName(event.target.value)}
            placeholder="이름, 혹은 익명"
            className="rounded-xl border border-[color-mix(in_srgb,var(--ink)_12%,transparent)] bg-white/60 px-3 py-2 text-sm text-ink outline-none focus:border-wax"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs tracking-wide text-ink-soft">
          받는 이 이메일
          <input
            required
            type="email"
            name="recipientEmail"
            value={recipientEmail}
            onChange={(event) => setRecipientEmail(event.target.value)}
            placeholder="tomorrow@you.com"
            className="rounded-xl border border-[color-mix(in_srgb,var(--ink)_12%,transparent)] bg-white/60 px-3 py-2 text-sm text-ink outline-none focus:border-wax"
          />
        </label>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs tracking-wide text-ink-soft">열어볼 날</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setOpenAt(addDays(preset.days))}
              className="rounded-full border border-[color-mix(in_srgb,var(--ink)_12%,transparent)] bg-white/50 px-3 py-1 text-xs text-ink-soft hover:border-wax hover:text-wax"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <input
          required
          type="datetime-local"
          min={minOpen}
          value={openAt}
          onChange={(event) => setOpenAt(event.target.value)}
          className="w-full rounded-xl border border-[color-mix(in_srgb,var(--ink)_12%,transparent)] bg-white/60 px-3 py-2 text-sm text-ink outline-none focus:border-wax"
        />
      </div>

      <label className="letter-well mt-6 block">
        <span className="sr-only">편지</span>
        {empty ? <WatercolorEmptyState /> : null}
        <textarea
          name="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={10}
          maxLength={8000}
          placeholder={empty ? "" : "남기고 싶은 말을 적으세요."}
          className="min-h-[280px] w-full resize-y rounded-2xl border border-[color-mix(in_srgb,var(--ink)_10%,transparent)] px-4 py-4 text-base leading-7 text-ink outline-none focus:border-wax"
        />
      </label>

      {error ? (
        <p className="mt-4 text-sm text-wax" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={pending || empty}
          className="wax-btn h-[92px] w-[92px] rounded-full text-[13px] leading-tight"
        >
          {pending ? "봉인 중" : (
            <>
              봉인
              <br />
              $2
            </>
          )}
        </button>
        <p className="max-w-xs text-center text-xs leading-5 text-ink-soft">
          {demo
            ? "데모에서는 결제를 건너뛰고 바로 봉인됩니다."
            : "Stripe로 $2를 결제하면 편지가 봉인되고, 선택한 날에 Resend로 도착합니다."}
        </p>
      </div>
    </form>
  );
}

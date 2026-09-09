"use client";

import { useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { Mark } from "@/components/Mark";
import { PrimaryButton } from "@/components/PrimaryButton";
import { WatercolorEmpty } from "@/components/WatercolorEmpty";
import { rememberCard } from "@/lib/local-cards";
import { digitsOnly, formatSeoul } from "@/lib/seoul";
import type { Locale, Messages } from "@/lib/i18n";
import { validateDraft } from "@/lib/validate";

const FIELD =
  "h-11 w-full rounded-lg border border-input bg-card px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

type FieldErrors = { email?: string; body?: string; unlockAt?: string };

type CreateFormProps = {
  locale: Locale;
  t: Messages;
  demo: boolean;
  canceled?: boolean;
  draftId?: string;
  draftUnlockLabel?: string;
};

export function CreateForm({
  locale,
  t,
  demo,
  canceled = false,
  draftId,
  draftUnlockLabel,
}: CreateFormProps) {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [phase, setPhase] = useState<"form" | "sealing" | "sealed">("form");
  const [sealedLabel, setSealedLabel] = useState<string | null>(null);
  const [fail, setFail] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const pristine = ![email, body, year, month, day, hour, minute].some((v) => v.trim());

  function show(field: keyof FieldErrors) {
    return Boolean(errors[field] && (touched[field] || submitted));
  }

  async function start() {
    setSubmitted(true);
    setTouched({ email: true, body: true, unlockAt: true });
    setFail(null);
    const local = validateDraft(
      {
        email,
        body,
        unlockYear: year,
        unlockMonth: month,
        unlockDay: day,
        unlockHour: hour,
        unlockMinute: minute,
      },
      locale,
    );
    if (!local.ok) {
      setErrors(local.errors);
      return;
    }
    setErrors({});

    if (demo) {
      const probe = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json", "x-yak-locale": locale },
        body: JSON.stringify({
          email,
          body,
          unlockYear: year,
          unlockMonth: month,
          unlockDay: day,
          unlockHour: hour,
          unlockMinute: minute,
          locale,
        }),
      });
      const data = (await probe.json()) as {
        error?: string;
        errors?: FieldErrors;
        token?: string;
        openAt?: string;
        demo?: boolean;
      };
      if (!probe.ok) {
        if (data.errors) setErrors(data.errors);
        setFail(data.error || t.create.startFailed);
        return;
      }
      setErrors({});
      setPhase("sealing");
      if (data.token && data.openAt) {
        rememberCard({ id: data.token, openAt: data.openAt, status: "sealed" });
        setSealedLabel(formatSeoul(data.openAt, locale));
      }
      window.setTimeout(() => setPhase("sealed"), 900);
      return;
    }

    setPhase("sealing");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json", "x-yak-locale": locale },
      body: JSON.stringify({
        email,
        body,
        unlockYear: year,
        unlockMonth: month,
        unlockDay: day,
        unlockHour: hour,
        unlockMinute: minute,
        locale,
      }),
    });
    const data = (await response.json()) as {
      url?: string;
      error?: string;
      errors?: FieldErrors;
      token?: string;
      openAt?: string;
    };
    if (!response.ok || !data.url) {
      if (data.errors) setErrors(data.errors);
      setFail(data.error || t.create.startFailed);
      setPhase("form");
      return;
    }
    if (data.token && data.openAt) {
      rememberCard({ id: data.token, openAt: data.openAt, status: "pending_payment" });
    }
    window.location.assign(data.url);
  }

  async function retry() {
    if (!draftId || demo) return;
    setRetrying(true);
    setFail(null);
    const response = await fetch("/api/checkout/retry", {
      method: "POST",
      headers: { "content-type": "application/json", "x-yak-locale": locale },
      body: JSON.stringify({ draftId, locale }),
    });
    const data = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !data.url) {
      setFail(data.error || t.create.startFailed);
      setRetrying(false);
      return;
    }
    window.location.assign(data.url);
  }

  const inputClass = FIELD;

  const empty = useMemo(() => <WatercolorEmpty t={t} />, [t]);

  if (phase === "sealing") {
    return (
      <div className="flex flex-col items-center px-2 py-16">
        <div className="origin-center animate-seal-in">
          <Mark label={t.brand.mark} />
        </div>
        <p className="mt-4 font-serif text-lg">{demo ? t.create.sealingDemo : t.create.sealingLive}</p>
      </div>
    );
  }

  if (phase === "sealed" && sealedLabel) {
    return (
      <section className="flex flex-col items-center rounded-3xl bg-card px-4 py-10 text-center ring-1 ring-foreground/8 sm:px-5">
        <Mark label={t.brand.mark} />
        <p className="mt-5 text-xs uppercase tracking-wide text-[color:var(--wax)]">{t.create.sealedEyebrow}</p>
        <h2 className="mt-2 font-serif text-2xl leading-snug">
          {sealedLabel} {t.create.sealedUntil}
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{t.create.sealedHidden}</p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      {canceled ? (
        <Notice
          tone="warning"
          title={t.create.canceledTitle}
          actions={
            draftId && !demo ? (
              <PrimaryButton type="button" disabled={retrying} onClick={() => void retry()}>
                {retrying ? t.create.sealingLive : t.create.retry}
              </PrimaryButton>
            ) : null
          }
        >
          <p>{t.create.canceledBody}</p>
          {draftUnlockLabel ? (
            <p className="mt-1">
              {t.create.canceledUnlock} {draftUnlockLabel}
            </p>
          ) : null}
          <p className="mt-1">{draftId && !demo ? t.create.canceledRetryHint : t.create.canceledRewriteHint}</p>
        </Notice>
      ) : pristine ? (
        empty
      ) : null}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t.create.email}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="off"
          inputMode="email"
          value={email}
          aria-invalid={show("email")}
          className={inputClass}
          placeholder={t.create.emailPlaceholder}
          onBlur={() => setTouched((s) => ({ ...s, email: true }))}
          onChange={(event) => setEmail(event.target.value)}
        />
        {show("email") ? (
          <p className="text-sm text-destructive">{errors.email}</p>
        ) : (
          <p className="text-xs text-muted-foreground">{t.create.emailHelp}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="body" className="text-sm font-medium">
            {t.create.body}
          </label>
          <span className="text-xs tabular-nums text-muted-foreground">
            {body.trim().length}/4000
          </span>
        </div>
        <textarea
          id="body"
          maxLength={4000}
          rows={8}
          value={body}
          aria-invalid={show("body")}
          className={`${inputClass} min-h-40 py-2`}
          placeholder={t.create.bodyPlaceholder}
          onBlur={() => setTouched((s) => ({ ...s, body: true }))}
          onChange={(event) => setBody(event.target.value)}
        />
        {show("body") ? (
          <p className="text-sm text-destructive">{errors.body}</p>
        ) : (
          <p className="text-xs text-muted-foreground">{t.create.bodyHelp}</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{t.create.dateLabel}</p>
        <div className="grid grid-cols-3 gap-2">
          <UnlockInput
            id="unlockYear"
            label={t.create.year}
            value={year}
            max={4}
            invalid={show("unlockAt")}
            className={inputClass}
            onChange={setYear}
            onBlur={() => setTouched((s) => ({ ...s, unlockAt: true }))}
          />
          <UnlockInput
            id="unlockMonth"
            label={t.create.month}
            value={month}
            max={2}
            invalid={show("unlockAt")}
            className={inputClass}
            onChange={setMonth}
            onBlur={() => setTouched((s) => ({ ...s, unlockAt: true }))}
          />
          <UnlockInput
            id="unlockDay"
            label={t.create.day}
            value={day}
            max={2}
            invalid={show("unlockAt")}
            className={inputClass}
            onChange={setDay}
            onBlur={() => setTouched((s) => ({ ...s, unlockAt: true }))}
          />
        </div>
        <p className="pt-1 text-sm font-medium">{t.create.timeLabel}</p>
        <div className="grid grid-cols-2 gap-2">
          <UnlockInput
            id="unlockHour"
            label={t.create.hour}
            value={hour}
            max={2}
            invalid={show("unlockAt")}
            className={inputClass}
            onChange={setHour}
            onBlur={() => setTouched((s) => ({ ...s, unlockAt: true }))}
          />
          <UnlockInput
            id="unlockMinute"
            label={t.create.minute}
            value={minute}
            max={2}
            invalid={show("unlockAt")}
            className={inputClass}
            onChange={setMinute}
            onBlur={() => setTouched((s) => ({ ...s, unlockAt: true }))}
          />
        </div>
        {show("unlockAt") ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.unlockAt}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">{t.create.dateHelp}</p>
        )}
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 space-y-3 border-t border-[color:var(--ink-border)] bg-[color:var(--paper)]/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pt-3 sm:pb-0 sm:backdrop-blur-none">
        {fail ? (
          <Notice tone="error" title={t.create.startFailed}>
            {fail}
          </Notice>
        ) : null}
        <PrimaryButton type="button" onClick={() => void start()}>
          {t.create.submit}
        </PrimaryButton>
        <p className="text-center text-xs leading-5 text-muted-foreground">
          {demo ? t.create.demoNote : t.create.liveNote}
        </p>
      </div>
    </div>
  );
}

function UnlockInput({
  id,
  label,
  value,
  max,
  invalid,
  className,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  value: string;
  max: number;
  invalid: boolean;
  className: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        maxLength={max}
        placeholder={label}
        aria-label={label}
        value={value}
        aria-invalid={invalid}
        className={`${className} text-center`}
        onBlur={onBlur}
        onChange={(event) => onChange(digitsOnly(event.target.value, max))}
      />
    </div>
  );
}

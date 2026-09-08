export function DemoBanner() {
  return (
    <div
      role="status"
      className="mb-6 rounded-full border border-[color-mix(in_srgb,var(--ink)_10%,transparent)] bg-white/50 px-4 py-2 text-center text-xs tracking-wide text-ink-soft backdrop-blur-sm"
    >
      DEMO_MODE — Stripe 결제 없이 $2 봉인을 시뮬레이션합니다. Supabase / Resend 키가 있으면 저장과 발송에 쓰입니다.
    </div>
  );
}

export function WatercolorEmptyState() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center px-6 text-center"
      aria-hidden="true"
    >
      <svg viewBox="0 0 260 160" className="h-36 w-56 opacity-90" role="img">
        <defs>
          <filter id="empty-wash" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="10" />
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>
        <g filter="url(#empty-wash)">
          <ellipse cx="130" cy="86" rx="92" ry="42" fill="#ead9c6" opacity="0.85" />
          <path d="M70 78l60-28 60 28-60 34z" fill="#f7efe4" stroke="#c9b29a" strokeWidth="1.2" />
          <path d="M70 78l60 28 60-28" fill="none" stroke="#c9b29a" strokeWidth="1.2" />
          <circle cx="130" cy="118" r="11" fill="#c5d4bf" />
          <path d="M130 110c6 8 16 16 8 28" fill="none" stroke="#7a8f74" strokeWidth="2" />
        </g>
      </svg>
      <p className="font-[family-name:var(--font-hand)] text-2xl text-ink-soft">
        아직 적힌 말이 없어요
      </p>
      <p className="mt-1 max-w-xs text-xs leading-5 text-ink-soft/80">
        땅속에 씨앗을 묻듯, 오늘의 편지를 남겨 두세요.
      </p>
    </div>
  );
}

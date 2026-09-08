export function WatercolorBackdrop() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-80"
      aria-hidden="true"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="wc" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="42" />
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <g filter="url(#wc)" className="wash-blob" opacity="0.55">
        <ellipse cx="180" cy="90" rx="280" ry="170" fill="#e7b8b2" />
        <ellipse cx="1080" cy="140" rx="260" ry="190" fill="#b9cde3" />
        <ellipse cx="980" cy="720" rx="300" ry="180" fill="#c5d4bf" />
        <ellipse cx="80" cy="680" rx="240" ry="160" fill="#e6d3a3" />
      </g>
    </svg>
  );
}

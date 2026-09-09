type MarkProps = {
  size?: number;
  label?: string | null;
  className?: string;
};

export function Mark({ size = 88, label = "약속", className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      aria-hidden="true"
      className={className ?? "shrink-0"}
    >
      <circle cx="44" cy="44" r="42" fill="#f4efe4" />
      <circle cx="44" cy="44" r="41.2" fill="none" stroke="#c5d1c0" strokeWidth="1.2" />
      <path
        d="M6.5 58.5C18 49.5 30 52.2 44 54.5C59 56.9 71 50.8 81.5 55.5V78.5C81.5 81 70 84.5 44 84.5C18 84.5 6.5 81 6.5 78.5V58.5Z"
        fill="#4f8a4a"
      />
      <path
        d="M6.5 62C20 55 33 57.5 44 59C58 60.8 70 56 81.5 59"
        fill="none"
        stroke="#3d7340"
        strokeWidth="1.1"
        opacity="0.45"
      />
      <rect x="42.2" y="44" width="3.6" height="15" rx="1.2" fill="#2a2418" />
      <ellipse cx="45.5" cy="34.5" rx="16.2" ry="15.4" fill="#163326" />
      {label ? (
        <text
          x="44"
          y="76"
          textAnchor="middle"
          fill="#f7f3ea"
          fontSize="12"
          fontWeight="600"
          fontFamily="var(--font-noto-sans), sans-serif"
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
}

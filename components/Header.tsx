export function Header() {
  return (
    <header className="mb-8 flex flex-col items-center text-center">
      <p className="mb-2 text-[11px] tracking-[0.42em] text-ink-soft uppercase">
        time capsule
      </p>
      <h1 className="font-[family-name:var(--font-serif)] text-[42px] font-medium leading-none tracking-[0.18em] text-ink sm:text-5xl">
        약속
      </h1>
      <p className="mt-3 max-w-sm font-[family-name:var(--font-display)] text-base italic text-ink-soft">
        오늘의 말을 봉인하고, 내일이 되어 돌려줍니다.
      </p>
    </header>
  );
}

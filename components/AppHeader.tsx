"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { Mark } from "@/components/Mark";
import { localizedPath, stripLocalePrefix, type Locale, type Messages } from "@/lib/i18n";

export function AppHeader({ locale, t }: { locale: Locale; t: Messages }) {
  const pathname = usePathname() || "/";
  const { path } = stripLocalePrefix(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--ink-border)] bg-[color:var(--paper)]/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-lg items-center justify-between px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        <Link
          href={localizedPath(locale, "/")}
          className="flex min-h-11 items-center gap-2 font-serif text-lg tracking-tight"
        >
          <Mark size={28} label={null} />
          <span>{locale === "en" ? t.brand.headerBilingual : t.brand.header}</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium text-[color:var(--wax)] sm:gap-4">
          <LangSwitch locale={locale} path={path} t={t} />
          <Link
            className="min-h-11 inline-flex items-center underline-offset-4 hover:underline"
            href={localizedPath(locale, "/capsules")}
          >
            {t.nav.list}
          </Link>
          <Link
            className="min-h-11 inline-flex items-center underline-offset-4 hover:underline"
            href={localizedPath(locale, "/new")}
          >
            {t.nav.create}
          </Link>
        </nav>
      </div>
    </header>
  );
}

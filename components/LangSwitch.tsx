import Link from "next/link";
import { localizedPath, type Locale, type Messages } from "@/lib/i18n";

export function LangSwitch({
  locale,
  path,
  t,
}: {
  locale: Locale;
  path: string;
  t: Messages;
}) {
  const other: Locale = locale === "en" ? "ko" : "en";
  return (
    <Link
      href={localizedPath(other, path)}
      className="min-h-11 inline-flex items-center text-xs tracking-wide text-muted-foreground underline-offset-4 hover:underline"
      hrefLang={other}
    >
      {other === "en" ? t.nav.langEn : t.nav.langKo}
    </Link>
  );
}

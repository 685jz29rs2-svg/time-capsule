import { Mark } from "@/components/Mark";
import { PageFrame } from "@/components/PageFrame";
import { PrimaryLink } from "@/components/PrimaryButton";
import { localizedPath } from "@/lib/i18n";
import { getDictionary } from "@/lib/locale";

export default async function HomePage() {
  const { locale, t } = await getDictionary();
  const titleLines = t.home.title.split("\n");
  return (
    <PageFrame center>
      <Mark size={96} label={t.brand.mark} />
      <h1 className="mt-6 font-serif text-[1.75rem] leading-tight tracking-tight sm:text-3xl">
        {titleLines.map((line, index) => (
          <span key={`${line}-${index}`}>
            {line}
            {index < titleLines.length - 1 ? <br /> : null}
          </span>
        ))}
      </h1>
      <p className="mt-4 max-w-sm text-[15px] leading-7 text-muted-foreground">{t.home.subtitle}</p>
      <PrimaryLink href={localizedPath(locale, "/new")} className="mt-10">
        {t.home.cta}
      </PrimaryLink>
      <p className="mt-4 max-w-sm text-xs leading-5 text-muted-foreground">{t.home.note}</p>
      {locale === "en" ? (
        <p className="mt-2 text-xs text-muted-foreground">{t.home.secondary}</p>
      ) : null}
    </PageFrame>
  );
}

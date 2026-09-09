import { Mark } from "@/components/Mark";
import { PageFrame } from "@/components/PageFrame";
import { PrimaryLink } from "@/components/PrimaryButton";
import { localizedPath } from "@/lib/i18n";
import { getDictionary } from "@/lib/locale";

export default async function NotFound() {
  const { locale, t } = await getDictionary();
  return (
    <PageFrame center>
      <Mark size={72} label={t.brand.markNone} />
      <h1 className="mt-6 font-serif text-2xl">{t.notFound.title}</h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{t.notFound.body}</p>
      <PrimaryLink href={localizedPath(locale, "/")} className="mt-8">
        {t.notFound.cta}
      </PrimaryLink>
    </PageFrame>
  );
}

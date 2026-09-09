import { notFound } from "next/navigation";
import { Mark } from "@/components/Mark";
import { PageFrame } from "@/components/PageFrame";
import { PrimaryLink } from "@/components/PrimaryButton";
import { getCapsuleByToken, isOpenable, isSealed } from "@/lib/capsules";
import { localizedPath } from "@/lib/i18n";
import { getDictionary } from "@/lib/locale";
import { formatSeoul } from "@/lib/seoul";

export default async function CapsuleOpenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { locale, t } = await getDictionary();
  const { id } = await params;
  const capsule = await getCapsuleByToken(decodeURIComponent(id));

  if (!capsule || !isSealed(capsule)) {
    notFound();
  }

  const until = formatSeoul(capsule.openAt, locale);

  if (!isOpenable(capsule)) {
    return (
      <PageFrame center>
        <Mark size={88} label={t.brand.mark} />
        <p className="mt-5 text-xs uppercase tracking-wide text-[color:var(--wax)]">{t.lock.title}</p>
        <h1 className="mt-2 font-serif text-2xl">{t.lock.title}</h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          {t.lock.body.replace("{date}", until)}
        </p>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t.lock.hint}</p>
        <p className="mt-6 text-sm text-muted-foreground">{t.lock.until}</p>
        <p className="font-serif text-lg">{until}</p>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <div className="flex flex-col items-center text-center">
        <Mark size={72} label={t.brand.mark} />
        <p className="mt-5 text-xs uppercase tracking-wide text-[color:var(--wax)]">{t.open.openedEyebrow}</p>
        <h1 className="mt-2 font-serif text-2xl">{t.open.openedTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{until}</p>
      </div>
      <article className="mt-8 whitespace-pre-wrap rounded-3xl bg-card px-5 py-6 text-base leading-7 ring-1 ring-foreground/8">
        {capsule.body}
      </article>
      <div className="mt-8 flex justify-center">
        <PrimaryLink href={localizedPath(locale, "/new")}>{t.open.create}</PrimaryLink>
      </div>
    </PageFrame>
  );
}

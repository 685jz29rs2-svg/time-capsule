import { CreateForm } from "@/components/CreateForm";
import { PageFrame } from "@/components/PageFrame";
import { getCapsuleByToken, isSealed } from "@/lib/capsules";
import { isDemoMode } from "@/lib/env";
import { getDictionary } from "@/lib/locale";
import { formatSeoul } from "@/lib/seoul";

export default async function NewPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string; draft?: string }>;
}) {
  const { locale, t } = await getDictionary();
  const params = await searchParams;
  const canceled = params.canceled === "1";
  const draftId = params.draft;
  let draftUnlockLabel: string | undefined;
  if (draftId) {
    const capsule = await getCapsuleByToken(draftId);
    if (capsule && !isSealed(capsule)) {
      draftUnlockLabel = formatSeoul(capsule.openAt, locale);
    }
  }

  return (
    <PageFrame>
      <h1 className="font-serif text-2xl">{t.write.title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.write.hint}</p>
      <div className="mt-6 sm:mt-8">
        <CreateForm
          locale={locale}
          t={t}
          demo={isDemoMode()}
          canceled={canceled}
          draftId={draftId}
          draftUnlockLabel={draftUnlockLabel}
        />
      </div>
    </PageFrame>
  );
}

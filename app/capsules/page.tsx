import { CapsuleList } from "@/components/CapsuleList";
import { PageFrame } from "@/components/PageFrame";
import { getDictionary } from "@/lib/locale";

export default async function CapsulesPage() {
  const { locale, t } = await getDictionary();
  return (
    <PageFrame>
      <h1 className="font-serif text-2xl">{t.list.title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.list.lead}</p>
      <CapsuleList locale={locale} t={t} />
    </PageFrame>
  );
}

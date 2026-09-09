import { Mark } from "@/components/Mark";
import { PageFrame } from "@/components/PageFrame";
import { PrimaryLink } from "@/components/PrimaryButton";
import { RememberCard } from "@/components/RememberCard";
import { getCapsuleByStripeSession, getCapsuleByToken, saveCapsule, sealCapsule } from "@/lib/capsules";
import { hasStripe, isDemoMode } from "@/lib/env";
import { localizedPath } from "@/lib/i18n";
import { getDictionary } from "@/lib/locale";
import { formatSeoul } from "@/lib/seoul";
import { getStripe } from "@/lib/stripe";

async function resolveSuccess(token?: string, sessionId?: string) {
  let capsule = token ? await getCapsuleByToken(token) : null;
  if (!capsule && sessionId) {
    capsule = await getCapsuleByStripeSession(sessionId);
  }
  if (capsule && sessionId && hasStripe() && capsule.status !== "sealed" && capsule.status !== "delivered") {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      capsule = await saveCapsule(sealCapsule(capsule, session.id));
    }
  }
  return capsule;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; session_id?: string; demo?: string }>;
}) {
  const { locale, t } = await getDictionary();
  const params = await searchParams;

  if (!params.session_id && !params.token) {
    return (
      <PageFrame center>
        <Mark size={72} label={t.brand.markNone} />
        <h1 className="mt-6 font-serif text-2xl">{t.success.missingTitle}</h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{t.success.missingBody}</p>
        <PrimaryLink href={localizedPath(locale, "/new")} className="mt-8">
          {t.success.missingCta}
        </PrimaryLink>
      </PageFrame>
    );
  }

  if (params.session_id && !hasStripe() && !isDemoMode()) {
    return (
      <PageFrame center>
        <Mark size={72} label={t.brand.markNone} />
        <h1 className="mt-6 font-serif text-2xl">{t.success.unconfiguredTitle}</h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{t.success.unconfiguredBody}</p>
        <PrimaryLink href={localizedPath(locale, "/new")} className="mt-8">
          {t.success.unconfiguredCta}
        </PrimaryLink>
      </PageFrame>
    );
  }

  const capsule = await resolveSuccess(params.token, params.session_id);
  const until = capsule ? formatSeoul(capsule.openAt, locale) : "";

  return (
    <PageFrame center>
      {capsule ? (
        <RememberCard id={capsule.token} openAt={capsule.openAt} status={capsule.status} />
      ) : null}
      <Mark size={88} label={t.brand.mark} />
      <p className="mt-5 text-xs uppercase tracking-wide text-[color:var(--wax)]">{t.success.title}</p>
      {until ? (
        <h1 className="mt-2 font-serif text-2xl leading-snug">
          {until} {t.success.until}
        </h1>
      ) : (
        <h1 className="mt-2 font-serif text-2xl">{t.success.title}</h1>
      )}
      <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{t.success.body}</p>
      <PrimaryLink href={localizedPath(locale, "/capsules")} className="mt-8">
        {t.success.list}
      </PrimaryLink>
    </PageFrame>
  );
}

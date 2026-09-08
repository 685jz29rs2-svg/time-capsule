import Link from "next/link";
import { getCapsuleByToken, saveCapsule, sealCapsule } from "@/lib/capsules";
import { hasStripe } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

async function confirmStripeSeal(token: string, sessionId?: string) {
  let capsule = await getCapsuleByToken(token);
  if (!capsule || !sessionId || !hasStripe()) return capsule;
  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  if (session.payment_status === "paid" && capsule.status === "draft") {
    capsule = await saveCapsule(sealCapsule(capsule, session.id));
  }
  return capsule;
}

export default async function SealedPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; session_id?: string }>;
}) {
  const { token, session_id: sessionId } = await searchParams;
  const capsule = token ? await confirmStripeSeal(token, sessionId) : null;
  const openAt = capsule
    ? new Date(capsule.openAt).toLocaleString("ko-KR", { dateStyle: "long", timeStyle: "short" })
    : null;

  return (
    <section className="paper-card mx-auto w-full max-w-xl rounded-[28px] px-8 py-12 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_25%,var(--wax-shine),var(--wax))] text-sm tracking-widest text-[#f8ece6] shadow-[0_10px_24px_rgba(122,46,46,0.28)]">
        SEAL
      </div>
      <h2 className="text-3xl font-medium tracking-wide">봉인되었습니다</h2>
      <p className="mt-3 text-ink-soft">
        {openAt
          ? `${openAt}이 되면, 받는 이에게 약속이 도착합니다.`
          : "선택한 날에 약속이 열립니다."}
      </p>
      {token ? (
        <p className="mt-6 text-sm">
          <Link className="text-wax underline decoration-wax/30 underline-offset-4" href={`/open/${encodeURIComponent(token)}`}>
            캡슐 보기
          </Link>
        </p>
      ) : null}
      <p className="mt-8 text-sm">
        <Link href="/" className="text-ink-soft hover:text-ink">
          새 약속 남기기
        </Link>
      </p>
    </section>
  );
}

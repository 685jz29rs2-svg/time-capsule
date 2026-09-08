import Link from "next/link";
import { getCapsuleByToken, isOpenable } from "@/lib/capsules";

export default async function OpenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const capsule = await getCapsuleByToken(decodeURIComponent(token));

  if (!capsule || capsule.status === "draft") {
    return (
      <section className="paper-card mx-auto w-full max-w-xl rounded-[28px] px-8 py-12 text-center">
        <h2 className="text-2xl">찾을 수 없는 약속입니다</h2>
        <p className="mt-3 text-sm text-ink-soft">
          DEMO_MODE의 메모리 저장은 서버가 재시작되면 사라질 수 있습니다. Supabase를 연결하면 영구 보관됩니다.
        </p>
        <Link href="/" className="mt-6 inline-block text-wax">
          돌아가기
        </Link>
      </section>
    );
  }

  const openable = isOpenable(capsule);
  const when = new Date(capsule.openAt).toLocaleString("ko-KR", {
    dateStyle: "long",
    timeStyle: "short",
  });

  if (!openable) {
    return (
      <section className="paper-card mx-auto w-full max-w-xl rounded-[28px] px-8 py-12 text-center">
        <p className="text-[11px] tracking-[0.42em] text-ink-soft">SEALED</p>
        <h2 className="mt-3 text-3xl font-medium">아직 때가 아니에요</h2>
        <p className="mt-3 text-ink-soft">{when}까지 봉인되어 있습니다.</p>
        <div className="mx-auto mt-8 h-16 w-16 rounded-full bg-[radial-gradient(circle_at_30%_25%,var(--wax-shine),var(--wax))]" />
      </section>
    );
  }

  return (
    <article className="paper-card mx-auto w-full max-w-xl rounded-[28px] px-8 py-12">
      <p className="text-center text-[11px] tracking-[0.42em] text-ink-soft">OPENED</p>
      <h2 className="mt-3 text-center text-3xl font-medium">봉인이 풀렸습니다</h2>
      <p className="mt-2 text-center text-sm text-ink-soft">
        {capsule.senderName || "익명"} · {when}
      </p>
      <div className="mt-8 whitespace-pre-wrap text-lg leading-8">{capsule.body}</div>
      <p className="mt-10 text-center text-sm">
        <Link href="/" className="text-wax">
          나도 약속을 남기기
        </Link>
      </p>
    </article>
  );
}

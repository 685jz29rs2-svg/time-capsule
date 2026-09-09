import { NextResponse } from "next/server";
import { getCapsuleByToken, isOpenable, isSealed } from "@/lib/capsules";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  const capsule = await getCapsuleByToken(decodeURIComponent(token));
  if (!capsule || !isSealed(capsule)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const openable = isOpenable(capsule);
  return NextResponse.json({
    id: capsule.id,
    token: capsule.token,
    openAt: capsule.openAt,
    sealedAt: capsule.sealedAt,
    status: capsule.status,
    openable,
    body: openable ? capsule.body : null,
  });
}

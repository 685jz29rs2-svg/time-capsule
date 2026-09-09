import { redirect } from "next/navigation";
import { getLocale } from "@/lib/locale";
import { localizedPath } from "@/lib/i18n";

export default async function LegacySealedPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; session_id?: string }>;
}) {
  const locale = await getLocale();
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.token) qs.set("token", params.token);
  if (params.session_id) qs.set("session_id", params.session_id);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  redirect(localizedPath(locale, `/new/success${suffix}`));
}

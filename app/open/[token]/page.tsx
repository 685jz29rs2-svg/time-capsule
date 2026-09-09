import { redirect } from "next/navigation";
import { getLocale } from "@/lib/locale";
import { localizedPath } from "@/lib/i18n";

export default async function LegacyOpenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const locale = await getLocale();
  redirect(localizedPath(locale, `/c/${encodeURIComponent(token)}`));
}

import { Composer } from "@/components/Composer";
import { isDemoMode } from "@/lib/env";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const params = await searchParams;
  return <Composer demo={isDemoMode()} canceled={params.canceled === "1"} />;
}

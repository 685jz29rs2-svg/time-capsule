import type { PublicCapsuleCard } from "@/lib/types";

export const LOCAL_CARDS_KEY = "yak.capsules.v1";

export function readLocalCards(): PublicCapsuleCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_CARDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PublicCapsuleCard[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((card) => card && typeof card.id === "string" && typeof card.openAt === "string");
  } catch {
    return [];
  }
}

export function rememberCard(card: PublicCapsuleCard) {
  if (typeof window === "undefined") return;
  const next = readLocalCards().filter((item) => item.id !== card.id);
  next.unshift(card);
  window.localStorage.setItem(LOCAL_CARDS_KEY, JSON.stringify(next.slice(0, 50)));
}

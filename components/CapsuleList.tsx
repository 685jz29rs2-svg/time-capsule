"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mark } from "@/components/Mark";
import { PrimaryLink } from "@/components/PrimaryButton";
import { localizedPath, type Locale, type Messages } from "@/lib/i18n";
import { readLocalCards } from "@/lib/local-cards";
import { formatSeoul } from "@/lib/seoul";
import type { PublicCapsuleCard } from "@/lib/types";

export function CapsuleList({ locale, t }: { locale: Locale; t: Messages }) {
  const [cards, setCards] = useState<PublicCapsuleCard[] | null>(null);

  useEffect(() => {
    setCards(readLocalCards());
  }, []);

  if (!cards || cards.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center text-center">
        <Mark size={72} label={t.list.mark} />
        <h2 className="mt-6 font-serif text-2xl">{t.list.emptyTitle}</h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{t.list.emptyBody}</p>
        <PrimaryLink href={localizedPath(locale, "/new")} className="mt-8">
          {t.list.cta}
        </PrimaryLink>
      </div>
    );
  }

  return (
    <ul className="mt-8 space-y-3">
      {cards.map((card) => {
        const openable = new Date(card.openAt).getTime() <= Date.now() && card.status !== "pending_payment";
        const label =
          card.status === "pending_payment" ? t.list.pending : openable ? t.list.ready : t.list.sealed;
        return (
          <li key={card.id}>
            {card.status === "pending_payment" ? (
              <div className="block rounded-2xl bg-card px-4 py-4 ring-1 ring-foreground/8">
                <p className="text-xs uppercase tracking-wide text-[color:var(--wax)]">{label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.list.unlockOnly}</p>
                <p className="font-serif text-lg leading-snug">{formatSeoul(card.openAt, locale)}</p>
              </div>
            ) : (
              <Link
                href={localizedPath(locale, `/c/${card.id}`)}
                className="block rounded-2xl bg-card px-4 py-4 ring-1 ring-foreground/8"
              >
                <p className="text-xs uppercase tracking-wide text-[color:var(--wax)]">{label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.list.unlockOnly}</p>
                <p className="font-serif text-lg leading-snug">{formatSeoul(card.openAt, locale)}</p>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

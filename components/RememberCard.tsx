"use client";

import { useEffect } from "react";
import { rememberCard } from "@/lib/local-cards";
import type { CapsuleStatus } from "@/lib/types";

export function RememberCard({
  id,
  openAt,
  status,
}: {
  id: string;
  openAt: string;
  status: CapsuleStatus;
}) {
  useEffect(() => {
    rememberCard({ id, openAt, status });
  }, [id, openAt, status]);
  return null;
}

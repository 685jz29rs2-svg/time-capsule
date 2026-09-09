import { hasSupabase } from "@/lib/env";
import { getSupabase } from "@/lib/supabase";
import { newId, verifyToken } from "@/lib/tokens";
import type { Capsule, CapsuleDraft, CapsuleStatus } from "@/lib/types";

type GlobalCapsules = typeof globalThis & {
  __timeCapsuleStore?: Map<string, Capsule>;
};

function memoryStore(): Map<string, Capsule> {
  const g = globalThis as GlobalCapsules;
  if (!g.__timeCapsuleStore) {
    g.__timeCapsuleStore = new Map();
  }
  return g.__timeCapsuleStore;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function createDraft(input: CapsuleDraft, status: CapsuleStatus = "pending_payment"): Capsule {
  const id = newId();
  return {
    id,
    token: id,
    senderName: (input.senderName ?? "").trim(),
    recipientEmail: input.recipientEmail.trim().toLowerCase(),
    body: input.body.trim(),
    openAt: new Date(input.openAt).toISOString(),
    createdAt: nowIso(),
    sealedAt: null,
    deliveredAt: null,
    status,
    stripeSessionId: null,
  };
}

export function sealCapsule(capsule: Capsule, stripeSessionId?: string | null): Capsule {
  return {
    ...capsule,
    status: "sealed",
    sealedAt: nowIso(),
    stripeSessionId: stripeSessionId ?? capsule.stripeSessionId,
  };
}

function fromRow(row: Record<string, unknown>): Capsule {
  return {
    id: String(row.id),
    token: String(row.token ?? row.id),
    senderName: String(row.sender_name ?? ""),
    recipientEmail: String(row.recipient_email ?? ""),
    body: String(row.body ?? ""),
    openAt: String(row.open_at),
    createdAt: String(row.created_at),
    sealedAt: row.sealed_at ? String(row.sealed_at) : null,
    deliveredAt: row.delivered_at ? String(row.delivered_at) : null,
    status: (row.status as CapsuleStatus) ?? "draft",
    stripeSessionId: row.stripe_session_id ? String(row.stripe_session_id) : null,
  };
}

function toRow(capsule: Capsule) {
  return {
    id: capsule.id,
    token: capsule.token,
    sender_name: capsule.senderName,
    recipient_email: capsule.recipientEmail,
    body: capsule.body,
    open_at: capsule.openAt,
    created_at: capsule.createdAt,
    sealed_at: capsule.sealedAt,
    delivered_at: capsule.deliveredAt,
    status: capsule.status,
    stripe_session_id: capsule.stripeSessionId,
  };
}

function indexCapsule(capsule: Capsule) {
  const store = memoryStore();
  store.set(capsule.token, capsule);
  store.set(capsule.id, capsule);
  if (capsule.stripeSessionId) {
    store.set(`stripe:${capsule.stripeSessionId}`, capsule);
  }
}

export async function saveCapsule(capsule: Capsule): Promise<Capsule> {
  indexCapsule(capsule);
  if (hasSupabase()) {
    const { error } = await getSupabase().from("capsules").upsert(toRow(capsule), {
      onConflict: "id",
    });
    if (error) throw new Error(`Supabase save failed: ${error.message}`);
  }
  return capsule;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getCapsuleByToken(token: string): Promise<Capsule | null> {
  const signed = verifyToken(token);
  if (signed) return signed;

  const mem = memoryStore().get(token);
  if (mem) return mem;
  if (!UUID_RE.test(token) || !hasSupabase()) return null;

  const { data, error } = await getSupabase()
    .from("capsules")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  if (error) throw new Error(`Supabase read failed: ${error.message}`);
  if (data) {
    const capsule = fromRow(data);
    indexCapsule(capsule);
    return capsule;
  }
  return null;
}

export async function getCapsuleByStripeSession(sessionId: string): Promise<Capsule | null> {
  const mem = memoryStore().get(`stripe:${sessionId}`);
  if (mem) return mem;
  if (hasSupabase()) {
    const { data, error } = await getSupabase()
      .from("capsules")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();
    if (error) throw new Error(`Supabase read failed: ${error.message}`);
    if (data) return fromRow(data);
  }
  return null;
}

export async function listDueCapsules(now = new Date()): Promise<Capsule[]> {
  const due: Capsule[] = [];
  const seen = new Set<string>();
  for (const capsule of memoryStore().values()) {
    if (seen.has(capsule.id)) continue;
    seen.add(capsule.id);
    if (capsule.status === "sealed" && new Date(capsule.openAt) <= now) {
      due.push(capsule);
    }
  }
  if (hasSupabase()) {
    const { data, error } = await getSupabase()
      .from("capsules")
      .select("*")
      .eq("status", "sealed")
      .lte("open_at", now.toISOString());
    if (error) throw new Error(`Supabase list failed: ${error.message}`);
    for (const row of data ?? []) {
      const capsule = fromRow(row);
      if (!seen.has(capsule.id)) due.push(capsule);
    }
  }
  return due;
}

export function isSealed(capsule: Capsule): boolean {
  return capsule.status === "sealed" || capsule.status === "delivered";
}

export function isOpenable(capsule: Capsule, now = new Date()): boolean {
  if (!isSealed(capsule)) return false;
  return new Date(capsule.openAt) <= now;
}

export function publicCard(capsule: Capsule) {
  return {
    id: capsule.id,
    openAt: capsule.openAt,
    status: capsule.status,
  };
}

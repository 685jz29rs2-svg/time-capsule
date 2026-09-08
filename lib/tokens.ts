import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { signingSecret } from "@/lib/env";
import type { Capsule } from "@/lib/types";

export function newId(): string {
  return randomUUID();
}

export function signToken(capsule: Capsule): string {
  const body = Buffer.from(JSON.stringify(capsule), "utf8").toString("base64url");
  const sig = createHmac("sha256", signingSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token: string): Capsule | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = createHmac("sha256", signingSecret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Capsule;
  } catch {
    return null;
  }
}

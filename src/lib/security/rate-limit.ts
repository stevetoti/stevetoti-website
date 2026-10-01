/**
 * Durable per-IP / per-email limits for public forms, shared by every Vercel
 * instance. Backed by Toti Room's existing service-role-only RPC
 * `toti_take_rate_limit` (migration 20260927000100_production_security.sql).
 * Keys are hashed, so raw emails and IPs are never stored.
 *
 * Fails closed: if the database can't be reached the request is refused,
 * the same stance as Turnstile.
 */
import { createHash } from "node:crypto";
import { restHeaders, serviceKey, supabaseUrl } from "@/lib/totiroom-db";

export type FormLimit = { kind: "ip" | "email"; value: string | undefined; limit: number; windowSeconds: number };

function bucket(form: string, kind: string, value: string): string {
  const hash = createHash("sha256").update(`${kind}:${value.trim().toLowerCase()}`).digest("hex");
  return `form:${form}:${kind}:${hash}`;
}

async function take(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const service = serviceKey();
  if (!service) {
    console.error("Form rate limit unavailable: service key not configured");
    return false;
  }
  try {
    const response = await fetch(`${supabaseUrl()}/rest/v1/rpc/toti_take_rate_limit`, {
      method: "POST",
      headers: restHeaders(service),
      body: JSON.stringify({ p_key: key, p_limit: limit, p_window_seconds: windowSeconds }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error("Form rate limit check failed:", response.status, await response.text());
      return false;
    }
    return (await response.json()) === true;
  } catch (error) {
    console.error("Form rate limit check failed:", error);
    return false;
  }
}

/** True when every applicable limit still has room. Limits without a value (e.g. unknown IP) are skipped. */
export async function withinFormLimits(form: string, limits: FormLimit[]): Promise<boolean> {
  for (const { kind, value, limit, windowSeconds } of limits) {
    if (!value) continue;
    if (!(await take(bucket(form, kind, value), limit, windowSeconds))) return false;
  }
  return true;
}

export const RATE_LIMITED_MESSAGE = "Too many submissions from you just now. Please wait a while and try again, or email me directly.";

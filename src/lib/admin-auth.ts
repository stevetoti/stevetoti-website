import { createHash, timingSafeEqual } from "node:crypto";

/** Validates the `Bearer <hash>-<expiry>` token issued by /api/admin/login. */
export function verifyAdminToken(authHeader: string | null): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const [hash, expiryStr] = authHeader.slice(7).split("-");
  const expiry = Number.parseInt(expiryStr ?? "", 10);
  if (!hash || !Number.isFinite(expiry) || Date.now() > expiry) return false;

  const expected = createHash("sha256").update(`${adminPassword}-${expiry}`).digest("hex");
  const a = Buffer.from(hash);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

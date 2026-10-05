import { createHmac, timingSafeEqual } from "node:crypto";
import { serviceKey } from "@/lib/totiroom-db";

function signature(value: string) {
  const key = serviceKey();
  if (!key) throw new Error("Guide access unavailable");
  return createHmac("sha256", key).update(`video-guide:${value}`).digest("hex");
}
export function guideDownloadUrl(slug: string) {
  const expires = Date.now() + 60 * 60 * 1000;
  return `/api/video-guide/${slug}?expires=${expires}&signature=${signature(`${slug}:${expires}`)}`;
}
export function validGuideAccess(slug: string, expires: string, token: string) {
  if (!/^\d+$/.test(expires) || Number(expires) <= Date.now() || !/^[a-f0-9]{64}$/.test(token)) return false;
  const expected = signature(`${slug}:${expires}`);
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

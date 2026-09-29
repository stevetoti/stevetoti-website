// Affiliate tools live in the Toti Room database (table: affiliate_tools).
// Public reads use the anon key (RLS only exposes published rows);
// admin writes and click logging use the service key on the server.

export interface AffiliateTool {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string | null;
  description: string;
  website_url: string | null;
  affiliate_url: string;
  image_url: string | null;
  cta_label: string;
  badge: string | null;
  is_own_product: boolean;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type AffiliateToolInput = Omit<AffiliateTool, "id" | "created_at" | "updated_at">;

export const TOOLS_STORAGE_BUCKET = "site-assets";
export const TOOLS_STORAGE_PREFIX = "affiliate-tools";

export function supabaseUrl(): string {
  // The production value carries a trailing newline; trim so built URLs stay clean.
  return (process.env.TOTIROOM_SUPABASE_URL || "https://rndegttgwtpkbjtvjgnc.supabase.co").trim().replace(/\/+$/, "");
}

function anonKey(): string | undefined {
  return (process.env.SUPABASE_TOTIROOM_ANON_KEY || process.env.TOTIROOM_SUPABASE_ANON_KEY)?.trim() || undefined;
}

export function serviceKey(): string | undefined {
  return (process.env.SUPABASE_TOTIROOM_SERVICE_KEY || process.env.TOTIROOM_SUPABASE_SERVICE_KEY)?.trim() || undefined;
}

export function restHeaders(key: string): Record<string, string> {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

/** Published tools for the public /tools page, ordered for display. */
export async function getPublishedTools(): Promise<AffiliateTool[]> {
  const key = anonKey();
  if (!key) return [];
  try {
    const response = await fetch(
      `${supabaseUrl()}/rest/v1/affiliate_tools?is_published=eq.true&order=sort_order.asc,name.asc`,
      { headers: restHeaders(key), next: { revalidate: 60, tags: ["affiliate-tools"] } },
    );
    if (!response.ok) {
      console.error("Failed to load affiliate tools:", response.status, await response.text());
      return [];
    }
    return (await response.json()) as AffiliateTool[];
  } catch (error) {
    console.error("Failed to load affiliate tools:", error);
    return [];
  }
}

export function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Image values may be a site-relative path (/images/...) or an absolute http(s) URL. */
export function isImageRef(value: unknown): value is string {
  return typeof value === "string" && (value.startsWith("/") && !value.startsWith("//") || isHttpUrl(value));
}

export function displayDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { verifyAdminToken } from "@/lib/admin-auth";
import {
  type AffiliateTool,
  type AffiliateToolInput,
  isHttpUrl,
  isImageRef,
  restHeaders,
  serviceKey,
  supabaseUrl,
} from "@/lib/affiliate-tools";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function notConfigured() {
  return NextResponse.json({ error: "Database service key is not configured" }, { status: 503 });
}

function refreshPublicPage() {
  revalidateTag("affiliate-tools");
  revalidatePath("/tools");
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Validates and normalises an admin-submitted tool. Returns an error message or the clean row. */
function parseTool(body: unknown): { error: string } | { tool: AffiliateToolInput } {
  if (!body || typeof body !== "object") return { error: "Invalid request" };
  const input = body as Record<string, unknown>;

  const name = text(input.name, 80);
  const slug = text(input.slug, 60).toLowerCase();
  const affiliateUrl = text(input.affiliate_url, 1000);
  const websiteUrl = text(input.website_url, 500);
  const imageUrl = text(input.image_url, 1000);
  const sortOrder = Number(input.sort_order);

  if (!name) return { error: "Name is required" };
  if (!SLUG.test(slug)) return { error: "Short link must use lowercase letters, numbers and dashes only" };
  if (!isHttpUrl(affiliateUrl)) return { error: "Affiliate link must start with https://" };
  if (websiteUrl && !isHttpUrl(websiteUrl)) return { error: "Website must start with https://" };
  if (imageUrl && !isImageRef(imageUrl)) return { error: "Image must be an uploaded image or an https:// link" };

  return {
    tool: {
      name,
      slug,
      category: text(input.category, 40) || "General",
      tagline: text(input.tagline, 120) || null,
      description: text(input.description, 600),
      website_url: websiteUrl || null,
      affiliate_url: affiliateUrl,
      image_url: imageUrl || null,
      cta_label: text(input.cta_label, 40) || "Get started",
      badge: text(input.badge, 30) || null,
      is_own_product: input.is_own_product === true,
      is_featured: input.is_featured === true,
      is_published: input.is_published !== false,
      sort_order: Number.isFinite(sortOrder) ? Math.round(sortOrder) : 100,
    },
  };
}

async function dbError(response: Response) {
  const detail = await response.text();
  console.error("affiliate_tools write failed:", response.status, detail);
  const message = detail.includes("affiliate_tools_slug_key")
    ? "That short link is already used by another tool"
    : "Could not save the tool. Please try again.";
  return NextResponse.json({ error: message }, { status: response.status === 409 ? 409 : 400 });
}

/** All tools (including drafts) with 30-day and all-time click counts. */
export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request.headers.get("authorization"))) return unauthorized();
  const key = serviceKey();
  if (!key) return notConfigured();

  const base = `${supabaseUrl()}/rest/v1`;
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  try {
    const [toolsResponse, clicksResponse] = await Promise.all([
      fetch(`${base}/affiliate_tools?order=sort_order.asc,name.asc`, { headers: restHeaders(key), cache: "no-store" }),
      fetch(`${base}/affiliate_clicks?select=tool_id,created_at&order=created_at.desc&limit=10000`, {
        headers: restHeaders(key),
        cache: "no-store",
      }),
    ]);
    if (!toolsResponse.ok) return NextResponse.json({ error: "Failed to load tools" }, { status: 502 });
    const tools = (await toolsResponse.json()) as AffiliateTool[];
    const clicks = clicksResponse.ok ? ((await clicksResponse.json()) as { tool_id: string | null; created_at: string }[]) : [];

    const stats: Record<string, { total: number; last30: number }> = {};
    for (const click of clicks) {
      if (!click.tool_id) continue;
      const entry = (stats[click.tool_id] ??= { total: 0, last30: 0 });
      entry.total += 1;
      if (click.created_at >= since) entry.last30 += 1;
    }
    return NextResponse.json({ data: tools.map((tool) => ({ ...tool, clicks: stats[tool.id] ?? { total: 0, last30: 0 } })) });
  } catch (error) {
    console.error("Admin tools load failed:", error);
    return NextResponse.json({ error: "Failed to load tools" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request.headers.get("authorization"))) return unauthorized();
  const key = serviceKey();
  if (!key) return notConfigured();

  const parsed = parseTool(await request.json().catch(() => null));
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const response = await fetch(`${supabaseUrl()}/rest/v1/affiliate_tools`, {
    method: "POST",
    headers: { ...restHeaders(key), Prefer: "return=representation" },
    body: JSON.stringify(parsed.tool),
  });
  if (!response.ok) return dbError(response);
  refreshPublicPage();
  const [data] = (await response.json()) as AffiliateTool[];
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminToken(request.headers.get("authorization"))) return unauthorized();
  const key = serviceKey();
  if (!key) return notConfigured();

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!UUID.test(id)) return NextResponse.json({ error: "Invalid tool" }, { status: 400 });
  const parsed = parseTool(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const response = await fetch(`${supabaseUrl()}/rest/v1/affiliate_tools?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...restHeaders(key), Prefer: "return=representation" },
    body: JSON.stringify(parsed.tool),
  });
  if (!response.ok) return dbError(response);
  const [data] = (await response.json()) as AffiliateTool[];
  if (!data) return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  refreshPublicPage();
  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request.headers.get("authorization"))) return unauthorized();
  const key = serviceKey();
  if (!key) return notConfigured();

  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (!UUID.test(id)) return NextResponse.json({ error: "Invalid tool" }, { status: 400 });

  const response = await fetch(`${supabaseUrl()}/rest/v1/affiliate_tools?id=eq.${id}`, {
    method: "DELETE",
    headers: restHeaders(key),
  });
  if (!response.ok) return dbError(response);
  refreshPublicPage();
  return NextResponse.json({ success: true });
}

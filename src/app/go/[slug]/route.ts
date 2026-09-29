import { NextRequest, NextResponse, after } from "next/server";
import { isHttpUrl, restHeaders, serviceKey, supabaseUrl } from "@/lib/affiliate-tools";

export const dynamic = "force-dynamic";

// /go/<slug> → records the click, then sends the visitor to the affiliate link.
// Keeps shared links stable even when an affiliate URL changes.
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fallback = new URL("/tools", request.nextUrl.origin);
  const key = serviceKey();
  if (!key || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return NextResponse.redirect(fallback, 302);

  let tool: { id: string; affiliate_url: string } | undefined;
  try {
    const response = await fetch(
      `${supabaseUrl()}/rest/v1/affiliate_tools?slug=eq.${slug}&is_published=eq.true&select=id,affiliate_url&limit=1`,
      { headers: restHeaders(key), cache: "no-store" },
    );
    if (response.ok) [tool] = (await response.json()) as { id: string; affiliate_url: string }[];
  } catch (error) {
    console.error("Affiliate lookup failed:", error);
  }
  if (!tool || !isHttpUrl(tool.affiliate_url)) return NextResponse.redirect(fallback, 302);

  const userAgent = request.headers.get("user-agent") || "";
  if (!/bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp/i.test(userAgent)) {
    const click = {
      tool_id: tool.id,
      slug,
      referrer: request.headers.get("referer")?.slice(0, 500) || null,
      country: request.headers.get("x-vercel-ip-country") || null,
    };
    after(async () => {
      try {
        await fetch(`${supabaseUrl()}/rest/v1/affiliate_clicks`, {
          method: "POST",
          headers: { ...restHeaders(key), Prefer: "return=minimal" },
          body: JSON.stringify(click),
        });
      } catch (error) {
        console.error("Affiliate click log failed:", error);
      }
    });
  }

  const response = NextResponse.redirect(tool.affiliate_url, 302);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

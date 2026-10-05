import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { episodes } from "@/lib/video-library";
import { validGuideAccess } from "@/lib/guide-access";
export const runtime = "nodejs";
export async function GET(request: NextRequest, { params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const episode = episodes.find(e => e.slug === slug);
  if (!episode) return new NextResponse("Guide not found", {status:404});
  const query = request.nextUrl.searchParams;
  try {
    if (!validGuideAccess(slug, query.get("expires") ?? "", query.get("signature") ?? "")) {
      return new NextResponse("Please sign up on the video lesson page to unlock this guide. Download links last one hour.", {status:403});
    }
    const filename = path.basename(episode.guide);
    const data = await readFile(path.join(process.cwd(), "private/video-guides", filename));
    return new NextResponse(new Uint8Array(data), {headers:{"Content-Type":"application/pdf", "Content-Disposition":`attachment; filename="${filename}"`, "Cache-Control":"private, no-store", "X-Content-Type-Options":"nosniff"}});
  } catch {
    return new NextResponse("Download temporarily unavailable. Please try again.", {status:503});
  }
}

import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";
import { TOOLS_STORAGE_BUCKET, TOOLS_STORAGE_PREFIX, serviceKey, supabaseUrl } from "@/lib/affiliate-tools";

export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024; // stays under Vercel's request body limit
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Uploads a tool image to the public site-assets bucket and returns its public URL. */
export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = serviceKey();
  if (!key) return NextResponse.json({ error: "Storage is not configured" }, { status: 503 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload" }, { status: 400 });
  const extension = EXTENSIONS[file.type];
  if (!extension) return NextResponse.json({ error: "Use a JPG, PNG, WebP or GIF image" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be 4 MB or smaller" }, { status: 400 });

  const path = `${TOOLS_STORAGE_PREFIX}/${randomUUID()}.${extension}`;
  const response = await fetch(`${supabaseUrl()}/storage/v1/object/${TOOLS_STORAGE_BUCKET}/${path}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": file.type, "Cache-Control": "31536000" },
    body: Buffer.from(await file.arrayBuffer()),
  });
  if (!response.ok) {
    console.error("Tool image upload failed:", response.status, await response.text());
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }
  return NextResponse.json({ url: `${supabaseUrl()}/storage/v1/object/public/${TOOLS_STORAGE_BUCKET}/${path}` });
}

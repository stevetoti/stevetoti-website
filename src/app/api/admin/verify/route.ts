import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const [hash, expiryStr] = token.split("-");
    const expiry = parseInt(expiryStr);

    if (Date.now() > expiry) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const expectedHash = createHash("sha256")
      .update(`${adminPassword}-${expiry}`)
      .digest("hex");

    if (hash !== expectedHash) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

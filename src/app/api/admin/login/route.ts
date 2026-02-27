import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin access not configured" },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Create a simple token (hash of password + timestamp for expiry)
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const token = createHash("sha256")
      .update(`${adminPassword}-${expiry}`)
      .digest("hex");

    return NextResponse.json({
      success: true,
      token: `${token}-${expiry}`,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

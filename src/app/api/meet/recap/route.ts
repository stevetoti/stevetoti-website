import { NextRequest, NextResponse } from "next/server";

// Forwards the meeting-room transcript to Toti Room's meet-recap function,
// which summarizes it, stores the meeting record, and emails Stephen.

const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co";

export async function POST(request: NextRequest) {
  try {
    const key = process.env.SUPABASE_TOTIROOM_ANON_KEY;
    if (!key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

    const body = await request.json();
    const res = await fetch(`${TOTIROOM_URL}/functions/v1/meet-recap`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : 502 });
  } catch (error) {
    console.error("Recap proxy error:", error);
    return NextResponse.json({ error: "Recap failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

// Notifies Stephen (email via Toti Room's send-notification edge function)
// that a participant in the meeting room wants him to join live.

const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co";

// Basic in-memory rate limit: one summon per room per 60s (per lambda instance).
const lastSummon = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const { room, requestedBy, participants } = (await request.json()) as {
      room?: string;
      requestedBy?: string;
      participants?: string[];
    };

    const roomKey = (room || "discovery").slice(0, 40);
    const now = Date.now();
    const last = lastSummon.get(roomKey) || 0;
    if (now - last < 60_000) {
      return NextResponse.json({ success: true, throttled: true });
    }
    lastSummon.set(roomKey, now);

    // One-click host join link for Stephen (host key bypasses booking check).
    const hostKey = process.env.MEET_HOST_KEY || "";
    const meetUrl = `https://stevetoti.com/meet?room=${encodeURIComponent(roomKey)}${
      hostKey ? `&key=${encodeURIComponent(hostKey)}` : ""
    }`;
    const key = process.env.SUPABASE_TOTIROOM_ANON_KEY;
    if (!key) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    await fetch(`${TOTIROOM_URL}/functions/v1/send-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        type: "meeting_summon",
        to: ["steve@pacificwavedigital.com", "toti@pacificwavedigital.com"],
        subject: `🔴 LIVE: ${requestedBy || "A participant"} needs you in the meeting room now`,
        data: {
          message: `${requestedBy || "A participant"} asked for you to join the live meeting with Toti.`,
          meetingLink: meetUrl,
          participants: (participants || []).slice(0, 10),
          requestedAt: new Date().toISOString(),
        },
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Summon error:", error);
    return NextResponse.json({ error: "Failed to notify" }, { status: 500 });
  }
}

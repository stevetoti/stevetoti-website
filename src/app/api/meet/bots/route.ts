import { NextRequest, NextResponse } from "next/server";

// Host-only control over Toti's meeting bots: list active bots, remove one
// from a call, or send Toti into a meeting URL on demand.
// Every request must carry the MEET_HOST_KEY.

const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co";

async function recall(action: string, data: Record<string, unknown>, key: string) {
  const res = await fetch(`${TOTIROOM_URL}/functions/v1/recall-bot`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ action, data }),
  });
  return { ok: res.ok, body: await res.json() };
}

export async function POST(request: NextRequest) {
  try {
    const { hostKey, action, botId, meetingUrl, meetingTitle } = (await request.json()) as {
      hostKey?: string;
      action?: string;
      botId?: string;
      meetingUrl?: string;
      meetingTitle?: string;
    };

    const configuredHostKey = process.env.MEET_HOST_KEY;
    if (!configuredHostKey || hostKey !== configuredHostKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const key = process.env.SUPABASE_TOTIROOM_ANON_KEY;
    if (!key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

    if (action === "list") {
      const { body } = await recall("list_active_bots", {}, key);
      const bots = (body.bots || []) as Array<Record<string, unknown>>;
      return NextResponse.json({
        bots: bots.map((b) => ({
          id: b.id,
          title: b.meeting_title,
          url: b.meeting_url,
          platform: b.meeting_platform,
          status: b.recall_status,
          joinedAt: b.joined_at,
          createdAt: b.created_at,
        })),
      });
    }

    if (action === "remove" && botId) {
      const { ok, body } = await recall("remove_bot", { botId }, key);
      return NextResponse.json(ok ? { success: true } : { error: body.error || "Remove failed" }, {
        status: ok ? 200 : 502,
      });
    }

    if (action === "send" && meetingUrl) {
      const { ok, body } = await recall(
        "create_bot",
        {
          meetingUrl,
          meetingTitle: meetingTitle || "Meeting with Steve",
          avatarMode: "video",
          clientMode: false, // Steve's own meeting — Toti assists him
        },
        key
      );
      return NextResponse.json(ok ? { success: true, bot: body.bot } : { error: body.error || "Send failed" }, {
        status: ok ? 200 : 502,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Bot control error:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

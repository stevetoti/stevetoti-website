import { NextRequest, NextResponse } from "next/server";

// TotiRoom Supabase edge function endpoint
const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co/functions/v1/video-avatar";

export async function POST(request: NextRequest) {
  const supabaseAnonKey = process.env.SUPABASE_TOTIROOM_ANON_KEY;

  if (!supabaseAnonKey) {
    console.error("SUPABASE_TOTIROOM_ANON_KEY not configured");
    return NextResponse.json(
      { error: "Supabase credentials not configured" },
      { status: 500 }
    );
  }

  // Optional meeting context from the /meet room (participant names, title)
  // so Toti knows who he is talking to. Always client-safe.
  let participants: string[] = [];
  let meetingTitle: string | undefined;
  let meetingNotes: string | undefined;
  try {
    const body = (await request.json()) as {
      participants?: unknown;
      meetingTitle?: unknown;
      meetingNotes?: unknown;
    };
    if (Array.isArray(body.participants)) {
      participants = body.participants
        .filter((p): p is string => typeof p === "string" && p.length > 0)
        .slice(0, 10);
    }
    if (typeof body.meetingTitle === "string") meetingTitle = body.meetingTitle.slice(0, 200);
    if (typeof body.meetingNotes === "string") meetingNotes = body.meetingNotes.slice(0, 1000);
  } catch {
    // No body (e.g. the site chat widget) — fine.
  }

  try {
    // Call TotiRoom video-avatar edge function to create session
    const response = await fetch(TOTIROOM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        action: "create_session",
        data: {
          clientMode: true, // PUBLIC website — client-facing prompt, never "Steve", no owner data
          participants,
          meetingTitle,
          meetingNotes,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("TotiRoom video-avatar error:", response.status, error);
      return NextResponse.json(
        { error: "Failed to get session token from TotiRoom" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.success || !data.sessionToken) {
      console.error("TotiRoom response missing sessionToken:", data);
      return NextResponse.json(
        { error: data.error || "Invalid response from TotiRoom" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      sessionToken: data.sessionToken,
      personaId: data.personaId,
      contextLoaded: data.contextLoaded,
    });
  } catch (error) {
    console.error("Anam session error:", error);
    return NextResponse.json(
      { error: "Failed to connect to TotiRoom" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

// TotiRoom Supabase edge function endpoint
const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co/functions/v1/video-avatar";

export async function POST() {
  const supabaseAnonKey = process.env.SUPABASE_TOTIROOM_ANON_KEY;

  if (!supabaseAnonKey) {
    console.error("SUPABASE_TOTIROOM_ANON_KEY not configured");
    return NextResponse.json(
      { error: "Supabase credentials not configured" },
      { status: 500 }
    );
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
          includeContext: true, // Include unified Toti context
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

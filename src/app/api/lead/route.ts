import { NextRequest, NextResponse } from "next/server";

// TotiRoom Supabase REST API
const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co/rest/v1";

interface LeadData {
  visitorName: string;
  visitorPhone: string;
  callReason: string;
  sessionId?: string;
  source?: string;
}

export async function POST(request: NextRequest) {
  const supabaseAnonKey = process.env.SUPABASE_TOTIROOM_ANON_KEY;

  if (!supabaseAnonKey) {
    console.error("SUPABASE_TOTIROOM_ANON_KEY not configured");
    return NextResponse.json(
      { error: "Service not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { visitorName, visitorPhone, callReason, sessionId, source = "stevetoti-website" } = body as LeadData;

    // Validate required fields
    if (!visitorName || !visitorPhone) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 }
      );
    }

    // Insert into toti_chat_sessions
    const response = await fetch(`${TOTIROOM_URL}/toti_chat_sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseAnonKey}`,
        "apikey": supabaseAnonKey,
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        visitor_id: sessionId || `visitor-${Date.now()}`,
        visitor_name: visitorName,
        visitor_phone: visitorPhone,
        call_reason: callReason,
        source,
        status: "video_started",
        created_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to save lead:", response.status, error);
      return NextResponse.json(
        { error: "Failed to save lead information" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true,
      sessionId: data[0]?.id || sessionId,
    });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { error: "Failed to process lead" },
      { status: 500 }
    );
  }
}

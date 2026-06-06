import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Always target the Toti Room project (where toti_chat_messages lives), with a
// public anon-key fallback so persistence works even without Vercel env vars set.
const supabaseUrl = process.env.TOTIROOM_SUPABASE_URL || "https://rndegttgwtpkbjtvjgnc.supabase.co";
const supabaseKey =
  process.env.TOTIROOM_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZGVndHRnd3Rwa2JqdHZqZ25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzIxMjAsImV4cCI6MjA4NDAwODEyMH0.0j4_x-CmkDlIAUC07N9zMs3i7iTN5468_liR7B4Mx2Y";

// GET - Load existing session messages
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");
  
  if (!sessionId || !supabaseUrl || !supabaseKey) {
    return NextResponse.json({ messages: [] });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get messages for this session
    const { data: messages, error } = await supabase
      .from("toti_chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Load messages error:", error);
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ 
      messages: messages?.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.created_at,
      })) || []
    });
  } catch (error) {
    console.error("Chat session load error:", error);
    return NextResponse.json({ messages: [] });
  }
}

// POST - Save new message
export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ success: false, error: "Not configured" });
  }

  try {
    const body = await request.json();
    const { sessionId, visitorId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ensure session exists
    const { data: existingSession } = await supabase
      .from("toti_chat_sessions")
      .select("id")
      .eq("id", sessionId)
      .single();

    if (!existingSession) {
      // Create new session
      await supabase.from("toti_chat_sessions").insert({
        id: sessionId,
        visitor_id: visitorId || sessionId,
        started_at: new Date().toISOString(),
      });
    }

    // Save the message
    const { error } = await supabase.from("toti_chat_messages").insert({
      session_id: sessionId,
      role: message.role,
      content: message.content,
      created_at: message.timestamp || new Date().toISOString(),
    });

    if (error) {
      console.error("Save message error:", error);
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chat session save error:", error);
    return NextResponse.json({ success: false, error: "Failed to save" });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co/rest/v1";

// Verify admin token
function verifyToken(authHeader: string | null): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false;
  
  const token = authHeader.split(" ")[1];
  const [hash, expiryStr] = token.split("-");
  const expiry = parseInt(expiryStr);

  if (Date.now() > expiry) return false;

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const expectedHash = createHash("sha256")
    .update(`${adminPassword}-${expiry}`)
    .digest("hex");

  return hash === expectedHash;
}

export async function GET(request: NextRequest) {
  if (!verifyToken(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseKey = process.env.SUPABASE_TOTIROOM_SERVICE_KEY || process.env.SUPABASE_TOTIROOM_ANON_KEY;
  if (!supabaseKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const limit = searchParams.get("limit") || "50";
  const offset = searchParams.get("offset") || "0";

  const headers = {
    "Authorization": `Bearer ${supabaseKey}`,
    "apikey": supabaseKey,
    "Content-Type": "application/json",
  };

  try {
    switch (type) {
      case "contacts": {
        const response = await fetch(
          `${TOTIROOM_URL}/contact_submissions?order=created_at.desc&limit=${limit}&offset=${offset}`,
          { headers }
        );
        const data = await response.json();
        
        // Get total count
        const countResponse = await fetch(
          `${TOTIROOM_URL}/contact_submissions?select=count`,
          { headers: { ...headers, "Prefer": "count=exact" } }
        );
        const total = parseInt(countResponse.headers.get("content-range")?.split("/")[1] || "0");
        
        return NextResponse.json({ data, total });
      }

      case "chats": {
        const response = await fetch(
          `${TOTIROOM_URL}/toti_chat_sessions?status=neq.video_started&order=created_at.desc&limit=${limit}&offset=${offset}`,
          { headers }
        );
        const data = await response.json();
        return NextResponse.json({ data });
      }

      case "chat-messages": {
        const sessionId = searchParams.get("sessionId");
        if (!sessionId) {
          return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        }
        const response = await fetch(
          `${TOTIROOM_URL}/toti_chat_messages?session_id=eq.${sessionId}&order=created_at.asc`,
          { headers }
        );
        const data = await response.json();
        return NextResponse.json({ data });
      }

      case "calls": {
        const response = await fetch(
          `${TOTIROOM_URL}/toti_chat_sessions?status=eq.video_started&order=created_at.desc&limit=${limit}&offset=${offset}`,
          { headers }
        );
        const data = await response.json();
        return NextResponse.json({ data });
      }

      case "stats": {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

        // Contact submissions count
        const contactsResponse = await fetch(
          `${TOTIROOM_URL}/contact_submissions?select=id,created_at`,
          { headers }
        );
        const contacts = await contactsResponse.json();

        // Chat sessions count
        const chatsResponse = await fetch(
          `${TOTIROOM_URL}/toti_chat_sessions?select=id,created_at,status`,
          { headers }
        );
        const chats = await chatsResponse.json();

        type Contact = { id: string; created_at: string };
        type Session = { id: string; created_at: string; status: string };

        const stats = {
          contacts: {
            total: contacts.length,
            today: contacts.filter((c: Contact) => c.created_at >= today).length,
            week: contacts.filter((c: Contact) => c.created_at >= weekAgo).length,
            month: contacts.filter((c: Contact) => c.created_at >= monthAgo).length,
          },
          chats: {
            total: chats.filter((c: Session) => c.status !== "video_started").length,
            today: chats.filter((c: Session) => c.status !== "video_started" && c.created_at >= today).length,
            week: chats.filter((c: Session) => c.status !== "video_started" && c.created_at >= weekAgo).length,
            month: chats.filter((c: Session) => c.status !== "video_started" && c.created_at >= monthAgo).length,
          },
          calls: {
            total: chats.filter((c: Session) => c.status === "video_started").length,
            today: chats.filter((c: Session) => c.status === "video_started" && c.created_at >= today).length,
            week: chats.filter((c: Session) => c.status === "video_started" && c.created_at >= weekAgo).length,
            month: chats.filter((c: Session) => c.status === "video_started" && c.created_at >= monthAgo).length,
          },
        };

        return NextResponse.json(stats);
      }

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin data error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyToken(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseKey = process.env.SUPABASE_TOTIROOM_SERVICE_KEY || process.env.SUPABASE_TOTIROOM_ANON_KEY;
  if (!supabaseKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const { table, id, updates } = await request.json();
    
    const response = await fetch(
      `${TOTIROOM_URL}/${table}?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${supabaseKey}`,
          "apikey": supabaseKey,
          "Content-Type": "application/json",
          "Prefer": "return=representation",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

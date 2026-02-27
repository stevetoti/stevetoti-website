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

function getHeaders() {
  const supabaseKey = process.env.TOTIROOM_SUPABASE_SERVICE_KEY || process.env.SUPABASE_TOTIROOM_ANON_KEY;
  return {
    "Authorization": `Bearer ${supabaseKey}`,
    "apikey": supabaseKey!,
    "Content-Type": "application/json",
  };
}

export async function GET(request: NextRequest) {
  if (!verifyToken(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseKey = process.env.TOTIROOM_SUPABASE_SERVICE_KEY || process.env.SUPABASE_TOTIROOM_ANON_KEY;
  if (!supabaseKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const limit = searchParams.get("limit") || "50";
  const offset = searchParams.get("offset") || "0";

  const headers = getHeaders();

  try {
    switch (type) {
      case "contacts": {
        const response = await fetch(
          `${TOTIROOM_URL}/contact_submissions?order=created_at.desc&limit=${limit}&offset=${offset}`,
          { headers }
        );
        const data = await response.json();
        return NextResponse.json({ data });
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

      case "newsletter": {
        const response = await fetch(
          `${TOTIROOM_URL}/newsletter_subscribers?order=subscribed_at.desc&limit=${limit}&offset=${offset}`,
          { headers }
        );
        const data = await response.json();
        return NextResponse.json({ data });
      }

      case "blog": {
        const response = await fetch(
          `${TOTIROOM_URL}/blog_posts?site_id=eq.stevetoti&order=created_at.desc&limit=${limit}&offset=${offset}`,
          { headers }
        );
        let data = await response.json();
        // Also try pwd site_id if stevetoti returns empty
        if (Array.isArray(data) && data.length === 0) {
          const pwdResponse = await fetch(
            `${TOTIROOM_URL}/blog_posts?order=created_at.desc&limit=${limit}&offset=${offset}`,
            { headers }
          );
          data = await pwdResponse.json();
        }
        return NextResponse.json({ data });
      }

      case "seo-settings": {
        // Fetch all SEO-related settings
        const response = await fetch(
          `${TOTIROOM_URL}/site_settings?site_id=eq.stevetoti`,
          { headers }
        );
        let settingsArray = await response.json();
        
        // Also check for pwd site_id
        if (Array.isArray(settingsArray) && settingsArray.length === 0) {
          const pwdResponse = await fetch(
            `${TOTIROOM_URL}/site_settings?site_id=eq.pwd`,
            { headers }
          );
          settingsArray = await pwdResponse.json();
        }

        // Convert array to object
        interface SettingRow { key: string; value: string }
        const data = settingsArray.reduce((acc: Record<string, string>, row: SettingRow) => {
          acc[row.key] = row.value;
          return acc;
        }, {});

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

        // Newsletter count
        const newsletterResponse = await fetch(
          `${TOTIROOM_URL}/newsletter_subscribers?select=id,subscribed_at&status=eq.active`,
          { headers }
        );
        const newsletter = await newsletterResponse.json();

        type Contact = { id: string; created_at: string };
        type Session = { id: string; created_at: string; status: string };
        type Subscriber = { id: string; subscribed_at: string };

        const stats = {
          contacts: {
            total: Array.isArray(contacts) ? contacts.length : 0,
            today: Array.isArray(contacts) ? contacts.filter((c: Contact) => c.created_at >= today).length : 0,
            week: Array.isArray(contacts) ? contacts.filter((c: Contact) => c.created_at >= weekAgo).length : 0,
            month: Array.isArray(contacts) ? contacts.filter((c: Contact) => c.created_at >= monthAgo).length : 0,
          },
          chats: {
            total: Array.isArray(chats) ? chats.filter((c: Session) => c.status !== "video_started").length : 0,
            today: Array.isArray(chats) ? chats.filter((c: Session) => c.status !== "video_started" && c.created_at >= today).length : 0,
            week: Array.isArray(chats) ? chats.filter((c: Session) => c.status !== "video_started" && c.created_at >= weekAgo).length : 0,
            month: Array.isArray(chats) ? chats.filter((c: Session) => c.status !== "video_started" && c.created_at >= monthAgo).length : 0,
          },
          calls: {
            total: Array.isArray(chats) ? chats.filter((c: Session) => c.status === "video_started").length : 0,
            today: Array.isArray(chats) ? chats.filter((c: Session) => c.status === "video_started" && c.created_at >= today).length : 0,
            week: Array.isArray(chats) ? chats.filter((c: Session) => c.status === "video_started" && c.created_at >= weekAgo).length : 0,
            month: Array.isArray(chats) ? chats.filter((c: Session) => c.status === "video_started" && c.created_at >= monthAgo).length : 0,
          },
          newsletter: {
            total: Array.isArray(newsletter) ? newsletter.length : 0,
            today: Array.isArray(newsletter) ? newsletter.filter((s: Subscriber) => s.subscribed_at >= today).length : 0,
            week: Array.isArray(newsletter) ? newsletter.filter((s: Subscriber) => s.subscribed_at >= weekAgo).length : 0,
            month: Array.isArray(newsletter) ? newsletter.filter((s: Subscriber) => s.subscribed_at >= monthAgo).length : 0,
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

export async function POST(request: NextRequest) {
  if (!verifyToken(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers = getHeaders();

  try {
    const body = await request.json();
    const { type, post } = body;

    if (type === "blog") {
      // Create new blog post
      const response = await fetch(`${TOTIROOM_URL}/blog_posts`, {
        method: "POST",
        headers: { ...headers, "Prefer": "return=representation" },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        const error = await response.text();
        return NextResponse.json({ error }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({ success: true, data: data[0] });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyToken(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers = getHeaders();

  try {
    const body = await request.json();
    const { type, post, settings } = body;

    if (type === "blog" && post?.id) {
      // Update existing blog post
      const response = await fetch(`${TOTIROOM_URL}/blog_posts?id=eq.${post.id}`, {
        method: "PATCH",
        headers: { ...headers, "Prefer": "return=representation" },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        const error = await response.text();
        return NextResponse.json({ error }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({ success: true, data: data[0] });
    }

    if (type === "seo-settings" && settings) {
      // Upsert SEO settings
      const siteId = "stevetoti";
      
      for (const [key, value] of Object.entries(settings)) {
        // Try to update first
        const updateResponse = await fetch(
          `${TOTIROOM_URL}/site_settings?site_id=eq.${siteId}&key=eq.${key}`,
          {
            method: "PATCH",
            headers: { ...headers, "Prefer": "return=representation" },
            body: JSON.stringify({ value }),
          }
        );

        const updateData = await updateResponse.json();
        
        // If no rows updated, insert
        if (Array.isArray(updateData) && updateData.length === 0) {
          await fetch(`${TOTIROOM_URL}/site_settings`, {
            method: "POST",
            headers,
            body: JSON.stringify({ site_id: siteId, key, value }),
          });
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyToken(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers = getHeaders();

  try {
    const { table, id, updates } = await request.json();
    
    const response = await fetch(
      `${TOTIROOM_URL}/${table}?id=eq.${id}`,
      {
        method: "PATCH",
        headers: { ...headers, "Prefer": "return=representation" },
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
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyToken(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers = getHeaders();

  try {
    const { table, id } = await request.json();
    
    const response = await fetch(
      `${TOTIROOM_URL}/${table}?id=eq.${id}`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

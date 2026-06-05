import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Toti's real brain lives in Toti Room as the locked-down `toti-concierge`
// edge function (knowledge base + live Cal.com availability + real booking,
// with NO access to any private/owner tools). We proxy to it here.
const CONCIERGE_URL =
  (process.env.TOTIROOM_SUPABASE_URL || "https://rndegttgwtpkbjtvjgnc.supabase.co") +
  "/functions/v1/toti-concierge";
const CONCIERGE_KEY =
  process.env.TOTIROOM_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_TOTIROOM_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZGVndHRnd3Rwa2JqdHZqZ25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzIxMjAsImV4cCI6MjA4NDAwODEyMH0.0j4_x-CmkDlIAUC07N9zMs3i7iTN5468_liR7B4Mx2Y";

export async function POST(request: NextRequest) {
  let messages: Message[] = [];
  try {
    const body = await request.json();
    messages = (body?.messages as Message[]) || [];
    if (!messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const res = await fetch(CONCIERGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${CONCIERGE_KEY}` },
      body: JSON.stringify({ messages: messages.map((m) => ({ role: m.role, content: m.content })) }),
    });
    const data = await res.json();
    if (data?.message) {
      return NextResponse.json({ message: data.message });
    }
    return NextResponse.json({
      message: getFallbackResponse(messages[messages.length - 1]?.content || ""),
      fallback: true,
    });
  } catch (error) {
    console.error("Chat proxy error:", error);
    return NextResponse.json({
      message: getFallbackResponse(messages[messages.length - 1]?.content || ""),
      fallback: true,
    });
  }
}

// Lightweight resilience fallback if the concierge is briefly unreachable.
function getFallbackResponse(userMessage: string): string {
  const m = userMessage.toLowerCase();
  if (m.includes("book") || m.includes("call") || m.includes("schedule") || m.includes("meet")) {
    return "I'd love to set up a free 30-minute discovery call with you. You can self-book here: https://cal.com/stevetotibooking/discovery-call-toti — or tell me your name, email and a preferred time and I'll arrange it.";
  }
  if (m.includes("service") || m.includes("do") || m.includes("offer")) {
    return "Steve helps businesses with 🤖 AI Automation, 💻 Web Development, 📊 Business Systems, 🎯 Consulting and 🎓 Training. Which area are you exploring?";
  }
  return "Thanks for reaching out! I can tell you about Steve's services or book you a free discovery call. What would you like to explore?";
}

import { NextRequest, NextResponse } from "next/server";
import { checkBotSignals } from "@/lib/security/bot-signals";
import { clientIpFromHeaders } from "@/lib/security/turnstile";
import { RATE_LIMITED_MESSAGE, withinFormLimits } from "@/lib/security/rate-limit";
import { restHeaders, serviceKey, supabaseUrl } from "@/lib/totiroom-db";

interface LeadData {
  visitorName?: unknown;
  visitorPhone?: unknown;
  callReason?: unknown;
  sessionId?: unknown;
  website?: string;
  form_started_at?: number;
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Lead details captured by the Toti chat widget before a video call.
// No Turnstile here (it would interrupt the chat), so the cheap bot signals and
// a durable per-IP limit run before anything is saved.
export async function POST(request: NextRequest) {
  const key = serviceKey();
  if (!key) {
    console.error("Lead capture unavailable: service key not configured");
    return NextResponse.json({ error: "Service not configured" }, { status: 503 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as LeadData;
    const visitorName = text(body.visitorName, 100);
    const visitorPhone = text(body.visitorPhone, 40);
    const callReason = text(body.callReason, 200);
    const sessionId = text(body.sessionId, 100);

    if (!visitorName || !visitorPhone) {
      return NextResponse.json({ error: "Name and phone number are required" }, { status: 400 });
    }
    if (!/^[+\d][\d\s().-]{5,}$/.test(visitorPhone)) {
      return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
    }

    const signals = checkBotSignals({ honeypot: body.website, formStartedAt: body.form_started_at });
    if (!signals.ok) {
      if (signals.reason === "honeypot") return NextResponse.json({ success: true });
      return NextResponse.json({ error: signals.message }, { status: 400 });
    }
    const ip = clientIpFromHeaders(request.headers);
    const allowed = await withinFormLimits("lead", [{ kind: "ip", value: ip, limit: 10, windowSeconds: 3600 }]);
    if (!allowed) return NextResponse.json({ error: RATE_LIMITED_MESSAGE }, { status: 429 });

    const response = await fetch(`${supabaseUrl()}/rest/v1/toti_chat_sessions`, {
      method: "POST",
      headers: { ...restHeaders(key), Prefer: "return=representation" },
      body: JSON.stringify({
        visitor_id: sessionId || `visitor-${Date.now()}`,
        visitor_name: visitorName,
        visitor_phone: visitorPhone,
        call_reason: callReason,
        source: "stevetoti-website",
        status: "video_started",
        created_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("Failed to save lead:", response.status, await response.text());
      return NextResponse.json({ error: "Failed to save lead information" }, { status: 502 });
    }

    const data = (await response.json()) as { id?: string }[];
    return NextResponse.json({ success: true, sessionId: data[0]?.id || sessionId });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ error: "Failed to process lead" }, { status: 500 });
  }
}

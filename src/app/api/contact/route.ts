import { NextRequest, NextResponse } from "next/server";
import { guardPublicForm } from "@/lib/security/form-guard";
import { clientIpFromHeaders } from "@/lib/security/turnstile";
import { RATE_LIMITED_MESSAGE, withinFormLimits } from "@/lib/security/rate-limit";

const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, service, budget, message, website, form_started_at, turnstile_token } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Bot defence (2026-09-30, form-bot-defence skill): honeypot, minimum fill
    // time, content sanity and server-verified Turnstile run BEFORE anything is
    // saved or emailed. The Sept spam (gibberish name, digit-only message) fails here.
    const ip = clientIpFromHeaders(request.headers);
    const guard = await guardPublicForm({ honeypot: website, formStartedAt: form_started_at, turnstileToken: turnstile_token, ip, message: String(message), name: String(name) });
    if (!guard.ok) {
      if (guard.reason === "honeypot") return NextResponse.json({ success: true });
      return NextResponse.json({ error: guard.message }, { status: 400 });
    }
    // Durable limits after the guard, so obvious bots never spend a slot.
    const allowed = await withinFormLimits("contact", [
      { kind: "ip", value: ip, limit: 5, windowSeconds: 3600 },
      { kind: "email", value: String(email), limit: 3, windowSeconds: 3600 },
    ]);
    if (!allowed) return NextResponse.json({ error: RATE_LIMITED_MESSAGE }, { status: 429 });

    // Call the edge function
    const response = await fetch(`${TOTIROOM_URL}/functions/v1/contact-form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUPABASE_TOTIROOM_ANON_KEY}`,
      },
      body: JSON.stringify({ name, email, company, service, budget, message, flags: guard.flags }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Edge function error:", data);
      return NextResponse.json(
        { error: data.error || "Failed to send message" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

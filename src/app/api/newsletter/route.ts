import { NextRequest, NextResponse } from "next/server";
import { guardPublicForm } from "@/lib/security/form-guard";
import { clientIpFromHeaders } from "@/lib/security/turnstile";
import { RATE_LIMITED_MESSAGE, withinFormLimits } from "@/lib/security/rate-limit";
import { restHeaders, serviceKey, supabaseUrl } from "@/lib/totiroom-db";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUCCESS = { success: true, message: "You're on the list!" };

interface NewsletterBody {
  email?: unknown;
  name?: unknown;
  website?: string;
  form_started_at?: number;
  turnstile_token?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as NewsletterBody;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";

    if (!EMAIL.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    // Bot defence (form-bot-defence skill): honeypot, fill time and Turnstile
    // before anything is stored; there is no free-text message to sanity-check.
    const ip = clientIpFromHeaders(request.headers);
    const guard = await guardPublicForm({
      honeypot: body.website,
      formStartedAt: body.form_started_at,
      turnstileToken: body.turnstile_token,
      ip,
      skipMessageCheck: true,
    });
    if (!guard.ok) {
      if (guard.reason === "honeypot") return NextResponse.json(SUCCESS);
      return NextResponse.json({ error: guard.message }, { status: 400 });
    }
    const allowed = await withinFormLimits("newsletter", [
      { kind: "ip", value: ip, limit: 5, windowSeconds: 3600 },
      { kind: "email", value: email, limit: 3, windowSeconds: 86400 },
    ]);
    if (!allowed) return NextResponse.json({ error: RATE_LIMITED_MESSAGE }, { status: 429 });

    const key = serviceKey();
    if (!key) {
      console.error("Newsletter signup unavailable: service key not configured");
      return NextResponse.json({ error: "Signups are temporarily unavailable. Please try again later." }, { status: 503 });
    }
    const base = `${supabaseUrl()}/rest/v1/newsletter_subscribers`;

    // Same answer whether or not the address is already subscribed, so the
    // form can't be used to check who is on the list.
    const existing = await fetch(`${base}?email=eq.${encodeURIComponent(email)}&select=id&limit=1`, {
      headers: restHeaders(key),
      cache: "no-store",
    });
    if (existing.ok && ((await existing.json()) as unknown[]).length > 0) return NextResponse.json(SUCCESS);

    const response = await fetch(base, {
      method: "POST",
      headers: { ...restHeaders(key), Prefer: "return=minimal" },
      body: JSON.stringify({ email, name: name || null, status: "active", source: "stevetoti.com" }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      if (errorText.includes("23505")) return NextResponse.json(SUCCESS);
      console.error("Newsletter signup error:", response.status, errorText);
      return NextResponse.json({ error: "Could not subscribe you just now. Please try again." }, { status: 500 });
    }

    return NextResponse.json(SUCCESS);
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ error: "Could not subscribe you just now. Please try again." }, { status: 500 });
  }
}

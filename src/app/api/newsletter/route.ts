import { NextRequest, NextResponse } from "next/server";
import { guardPublicForm } from "@/lib/security/form-guard";
import { clientIpFromHeaders } from "@/lib/security/turnstile";
import { RATE_LIMITED_MESSAGE, withinFormLimits } from "@/lib/security/rate-limit";
import { restHeaders, serviceKey, supabaseUrl } from "@/lib/totiroom-db";

import { episodes } from "@/lib/video-library";
import { guideDownloadUrl } from "@/lib/guide-access";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUCCESS = { success: true, message: "You're on the list!" };

interface NewsletterBody {
  guide_slug?: unknown;
  newsletter_consent?: unknown;
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

    const guide = body.guide_slug === undefined ? undefined : episodes.find(e => e.slug === body.guide_slug);
    if (body.guide_slug !== undefined && (!guide || !name || body.newsletter_consent !== true)) {
      return NextResponse.json({ error: "Enter your name and confirm newsletter signup to receive this guide." }, { status: 400 });
    }
    const success = () => NextResponse.json(guide ? { ...SUCCESS, download_url: guideDownloadUrl(guide.slug) } : SUCCESS, { headers: { "Cache-Control": "no-store" } });

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
    if (!existing.ok) throw new Error("Subscriber lookup unavailable");
    if (((await existing.json()) as unknown[]).length > 0) {
      if (guide) {
        const updated = await fetch(`${base}?email=eq.${encodeURIComponent(email)}`, {
          method: "PATCH", headers: { ...restHeaders(key), Prefer: "return=minimal" },
          body: JSON.stringify({ name, status: "active", source: `stevetoti.com/videos/${guide.slug};newsletter-consent-v1;${new Date().toISOString()}` }),
        });
        if (!updated.ok) throw new Error("Subscriber update unavailable");
      }
      return success();
    }

    const response = await fetch(base, {
      method: "POST",
      headers: { ...restHeaders(key), Prefer: "return=minimal" },
      body: JSON.stringify({ email, name: name || null, status: "active", source: guide ? `stevetoti.com/videos/${guide.slug};newsletter-consent-v1;${new Date().toISOString()}` : "stevetoti.com" }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      if (errorText.includes("23505")) return success();
      console.error("Newsletter signup error:", response.status, errorText);
      return NextResponse.json({ error: "Could not subscribe you just now. Please try again." }, { status: 500 });
    }

    return success();
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ error: "Could not subscribe you just now. Please try again." }, { status: 500 });
  }
}

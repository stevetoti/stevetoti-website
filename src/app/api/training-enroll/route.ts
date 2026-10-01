import { NextRequest, NextResponse } from "next/server";
import { guardPublicForm } from "@/lib/security/form-guard";
import { clientIpFromHeaders } from "@/lib/security/turnstile";
import { RATE_LIMITED_MESSAGE, withinFormLimits } from "@/lib/security/rate-limit";

const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co";

interface EnrolmentBody {
  name?: string;
  email?: string;
  phone?: string;
  paymentPlan?: string;
  message?: string;
  package?: string;
  price?: string;
  region?: string;
  website?: string;
  form_started_at?: number;
  turnstile_token?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EnrolmentBody = await request.json();
    const { name, email, phone, paymentPlan, message, price, region } = body;
    const pkg = body.package;

    if (!name || !email || !phone || !pkg) {
      return NextResponse.json(
        { error: "Name, email, phone and package are required" },
        { status: 400 }
      );
    }

    // Bot defence (form-bot-defence skill): this form emails the inbox via the
    // same contact-form function, so it gets the full guard and durable limits.
    const ip = clientIpFromHeaders(request.headers);
    const guard = await guardPublicForm({
      honeypot: body.website,
      formStartedAt: body.form_started_at,
      turnstileToken: body.turnstile_token,
      ip,
      message: message || null,
      name,
    });
    if (!guard.ok) {
      if (guard.reason === "honeypot") return NextResponse.json({ success: true });
      return NextResponse.json({ error: guard.message }, { status: 400 });
    }
    const allowed = await withinFormLimits("training", [
      { kind: "ip", value: ip, limit: 5, windowSeconds: 3600 },
      { kind: "email", value: email, limit: 3, windowSeconds: 3600 },
    ]);
    if (!allowed) return NextResponse.json({ error: RATE_LIMITED_MESSAGE }, { status: 429 });

    const composedMessage = [
      "🎓 TRAINING ENROLMENT REQUEST",
      "",
      `Package: ${pkg}`,
      `Region: ${region || "Not specified"}`,
      `Price: ${price || "Not specified"}`,
      `Payment preference: ${paymentPlan || "Not specified"}`,
      `Phone / WhatsApp: ${phone}`,
      "",
      message ? `Goals: ${message}` : "Goals: (not provided)",
    ].join("\n");

    const response = await fetch(`${TOTIROOM_URL}/functions/v1/contact-form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUPABASE_TOTIROOM_ANON_KEY}`,
      },
      body: JSON.stringify({
        name,
        email,
        company: region || "",
        service: "1-on-1 Training Enrolment",
        budget: price || "",
        message: composedMessage,
        flags: guard.flags,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Edge function error:", data);
      return NextResponse.json(
        { error: data.error || "Failed to submit enrolment" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Training enrolment API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

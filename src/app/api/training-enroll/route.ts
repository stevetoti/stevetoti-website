import { NextRequest, NextResponse } from "next/server";

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

import { NextRequest, NextResponse } from "next/server";

const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co/rest/v1";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabaseKey = process.env.TOTIROOM_SUPABASE_SERVICE_KEY;
    if (!supabaseKey) {
      return NextResponse.json(
        { error: "Service not configured" },
        { status: 500 }
      );
    }

    // Insert subscriber
    const response = await fetch(`${TOTIROOM_URL}/newsletter_subscribers`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseKey}`,
        "apikey": supabaseKey,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        name: name || null,
        status: "active",
        source: "website",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Check for duplicate
      if (errorText.includes("duplicate") || errorText.includes("23505")) {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 409 }
        );
      }
      
      console.error("Newsletter signup error:", errorText);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Successfully subscribed!" });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, service, budget, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Call the edge function
    const response = await fetch(`${TOTIROOM_URL}/functions/v1/contact-form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUPABASE_TOTIROOM_ANON_KEY}`,
      },
      body: JSON.stringify({ name, email, company, service, budget, message }),
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

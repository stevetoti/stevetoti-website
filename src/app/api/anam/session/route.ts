import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.ANAM_API_KEY;
  const personaId = process.env.ANAM_PERSONA_ID;

  if (!apiKey || !personaId) {
    return NextResponse.json(
      { error: "Anam AI credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        personaConfig: {
          id: personaId,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anam API error:", response.status, error);
      return NextResponse.json(
        { error: "Failed to get session token" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ sessionToken: data.sessionToken });
  } catch (error) {
    console.error("Anam session error:", error);
    return NextResponse.json(
      { error: "Failed to connect to Anam AI" },
      { status: 500 }
    );
  }
}

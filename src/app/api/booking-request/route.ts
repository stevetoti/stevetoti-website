import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, preferredTime, notes, sessionId } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Save to Supabase if configured
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { error } = await supabase.from("booking_requests").insert({
        name,
        email,
        phone: phone || null,
        preferred_time: preferredTime || null,
        notes: notes || null,
        chat_session_id: sessionId || null,
        status: "pending",
        source: "chat_assistant",
      });

      if (error) {
        console.error("Supabase error:", error);
        // Continue anyway - we'll send email notification
      }
    }

    // Send notification email (using TotiRoom edge function or direct)
    try {
      const totiRoomUrl = process.env.TOTIROOM_SUPABASE_URL;
      const totiRoomKey = process.env.TOTIROOM_SUPABASE_ANON_KEY;
      
      if (totiRoomUrl && totiRoomKey) {
        await fetch(`${totiRoomUrl}/functions/v1/send-notification`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${totiRoomKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "booking_request",
            to: ["steve@pacificwavedigital.com", "toti@pacificwavedigital.com"],
            subject: `📅 New Booking Request from ${name}`,
            data: { name, email, phone, preferredTime, notes },
          }),
        });
      }
    } catch (emailError) {
      console.error("Email notification error:", emailError);
    }

    return NextResponse.json({ 
      success: true,
      message: "Booking request submitted successfully",
    });
  } catch (error) {
    console.error("Booking request error:", error);
    return NextResponse.json(
      { error: "Failed to process booking request" },
      { status: 500 }
    );
  }
}

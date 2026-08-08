import { NextRequest, NextResponse } from "next/server";

// Executes Toti's in-meeting "send email to participant" tool. The email goes
// only to the address the participant verified with (passed from the room).

const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co";
const BOOKING_LINK = "https://cal.com/stevetotibooking/discovery-call-toti";

// Light abuse guard: max 5 sends per email per 10 minutes (per instance).
const sendLog = new Map<string, number[]>();

export async function POST(request: NextRequest) {
  try {
    const { toEmail, toName, subject, message, includeBookingLink } =
      (await request.json()) as {
        toEmail?: string;
        toName?: string;
        subject?: string;
        message?: string;
        includeBookingLink?: boolean;
      };

    const email = (toEmail || "").trim().toLowerCase();
    if (!email.includes("@") || !message) {
      return NextResponse.json({ error: "Missing email or message" }, { status: 400 });
    }

    const now = Date.now();
    const recent = (sendLog.get(email) || []).filter((t) => now - t < 10 * 60 * 1000);
    if (recent.length >= 5) {
      return NextResponse.json({ error: "Too many emails to this address" }, { status: 429 });
    }
    recent.push(now);
    sendLog.set(email, recent);

    const key = process.env.SUPABASE_TOTIROOM_ANON_KEY;
    if (!key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

    const res = await fetch(`${TOTIROOM_URL}/functions/v1/send-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        type: "toti_meeting_email",
        to: [email],
        subject: (subject || "A note from Toti").slice(0, 150),
        data: {
          message: `${toName ? `Hi ${toName.split(" ")[0]},\n\n` : ""}${String(message).slice(0, 3000)}`,
          meetingLink: includeBookingLink ? BOOKING_LINK : undefined,
          linkLabel: includeBookingLink ? "Book your call with Steve" : undefined,
        },
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return NextResponse.json({ error: data.error || "Send failed" }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("toti-action error:", error);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}

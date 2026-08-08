import { NextRequest, NextResponse } from "next/server";

/**
 * Gates the /meet room behind real bookings + email ownership (OTP).
 *
 * Flow:
 *  1. { email } — if that email has any confirmed booking, we send a 6-digit
 *     code to it (via the Toti Room `otp` edge function) and return
 *     { otpRequired: true }. NOTHING about the booking is revealed yet.
 *  2. { email, code } — code is verified (proves inbox ownership), then:
 *     - inside the join window (15 min before start → 10 min grace after end)
 *       → returns the private room id (evt-<event id>).
 *     - otherwise → returns their upcoming booking details.
 *  - { hostKey } matching MEET_HOST_KEY (Stephen) bypasses everything.
 */

const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co";
const JOIN_EARLY_MS = 15 * 60 * 1000;
const JOIN_LATE_GRACE_MS = 10 * 60 * 1000;

interface CalendarEventRow {
  id: string;
  title: string | null;
  description: string | null;
  start_time: string;
  end_time: string | null;
  status: string;
  attendees: Array<{ name?: string; email?: string }> | null;
}

async function lookupBookings(email: string, key: string): Promise<CalendarEventRow[] | null> {
  const filter = encodeURIComponent(`[{"email":"${email}"}]`);
  const res = await fetch(
    `${TOTIROOM_URL}/rest/v1/calendar_events?status=eq.confirmed&attendees=cs.${filter}&order=start_time.asc&select=id,title,description,start_time,end_time,status,attendees`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) {
    console.error("calendar_events lookup failed:", res.status, await res.text());
    return null;
  }
  return (await res.json()) as CalendarEventRow[];
}

export async function POST(request: NextRequest) {
  try {
    const { email, code, hostKey, room } = (await request.json()) as {
      email?: string;
      code?: string;
      hostKey?: string;
      room?: string;
    };

    // Host bypass (Stephen)
    const configuredHostKey = process.env.MEET_HOST_KEY;
    if (hostKey && configuredHostKey && hostKey === configuredHostKey) {
      return NextResponse.json({
        ok: true,
        host: true,
        room: (room || "discovery").slice(0, 60),
        name: "Stephen",
        title: "Meeting room",
      });
    }

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json({ ok: false, reason: "invalid_email" }, { status: 400 });
    }

    const key = process.env.SUPABASE_TOTIROOM_ANON_KEY;
    if (!key) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const rows = await lookupBookings(cleanEmail, key);
    if (rows === null) {
      return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
    }

    const now = Date.now();
    const hasRelevantBooking = rows.some((r) => {
      const start = new Date(r.start_time).getTime();
      const end = r.end_time ? new Date(r.end_time).getTime() : start + 30 * 60 * 1000;
      return start > now || (now >= start - JOIN_EARLY_MS && now <= end + JOIN_LATE_GRACE_MS);
    });

    if (!hasRelevantBooking) {
      return NextResponse.json({ ok: false, reason: "no_booking" });
    }

    const otpHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    };

    // PHASE 1 — no code yet: send the OTP, reveal nothing else.
    if (!code) {
      const sendRes = await fetch(`${TOTIROOM_URL}/functions/v1/otp`, {
        method: "POST",
        headers: otpHeaders,
        body: JSON.stringify({ action: "send", email: cleanEmail }),
      });
      if (!sendRes.ok) {
        console.error("OTP send failed:", sendRes.status, await sendRes.text());
        return NextResponse.json({ error: "Could not send code" }, { status: 502 });
      }
      return NextResponse.json({ ok: false, otpRequired: true });
    }

    // PHASE 2 — verify the code (proves inbox ownership).
    const verifyRes = await fetch(`${TOTIROOM_URL}/functions/v1/otp`, {
      method: "POST",
      headers: otpHeaders,
      body: JSON.stringify({ action: "verify", email: cleanEmail, code: String(code).trim() }),
    });
    const verifyData = (await verifyRes.json()) as { verified?: boolean; error?: string };
    if (!verifyRes.ok || !verifyData.verified) {
      return NextResponse.json({ ok: false, reason: "bad_code" });
    }

    const attendeeName = (row: CalendarEventRow) =>
      row.attendees?.find((a) => (a.email || "").toLowerCase() === cleanEmail)?.name || "";

    // Active booking: inside the join window right now.
    const active = rows.find((r) => {
      const start = new Date(r.start_time).getTime();
      const end = r.end_time ? new Date(r.end_time).getTime() : start + 30 * 60 * 1000;
      return now >= start - JOIN_EARLY_MS && now <= end + JOIN_LATE_GRACE_MS;
    });

    if (active) {
      return NextResponse.json({
        ok: true,
        room: `evt-${active.id}`,
        title: active.title || "Discovery Call with Toti",
        start: active.start_time,
        end: active.end_time,
        name: attendeeName(active),
        notes: active.description || undefined,
      });
    }

    const upcoming = rows.find((r) => new Date(r.start_time).getTime() > now);
    if (upcoming) {
      return NextResponse.json({
        ok: false,
        reason: "not_yet",
        upcoming: {
          title: upcoming.title || "Discovery Call with Toti",
          start: upcoming.start_time,
          name: attendeeName(upcoming),
        },
      });
    }

    return NextResponse.json({ ok: false, reason: "no_booking" });
  } catch (error) {
    console.error("Meet verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

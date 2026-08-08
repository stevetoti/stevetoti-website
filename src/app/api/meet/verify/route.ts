import { NextRequest, NextResponse } from "next/server";

/**
 * Gates the /meet room behind real bookings.
 *
 * - Visitor submits the email they booked with. We look up their confirmed
 *   Cal.com booking in the Toti Room `calendar_events` table.
 * - Inside the join window (15 min before start → end of slot) → returns the
 *   private room id (the event id) so they can join.
 * - Outside the window → returns their upcoming booking so the page can show
 *   the time and add-to-calendar options.
 * - `hostKey` matching MEET_HOST_KEY (Stephen) bypasses everything and may
 *   join any room, incl. ad-hoc rooms.
 */

const TOTIROOM_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co";
const JOIN_EARLY_MS = 15 * 60 * 1000;
const JOIN_LATE_GRACE_MS = 10 * 60 * 1000;

interface CalendarEventRow {
  id: string;
  title: string | null;
  start_time: string;
  end_time: string | null;
  status: string;
  attendees: Array<{ name?: string; email?: string }> | null;
}

export async function POST(request: NextRequest) {
  try {
    const { email, hostKey, room } = (await request.json()) as {
      email?: string;
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

    // Confirmed bookings that contain this attendee email, newest window first.
    const filter = encodeURIComponent(`[{"email":"${cleanEmail}"}]`);
    const res = await fetch(
      `${TOTIROOM_URL}/rest/v1/calendar_events?status=eq.confirmed&attendees=cs.${filter}&order=start_time.asc&select=id,title,start_time,end_time,status,attendees`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) {
      console.error("calendar_events lookup failed:", res.status, await res.text());
      return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
    }

    const rows = (await res.json()) as CalendarEventRow[];
    const now = Date.now();

    const attendeeName = (row: CalendarEventRow) =>
      row.attendees?.find((a) => (a.email || "").toLowerCase() === cleanEmail)?.name || "";

    // Active booking: inside the join window right now.
    const active = rows.find((r) => {
      const start = new Date(r.start_time).getTime();
      const end = r.end_time
        ? new Date(r.end_time).getTime()
        : start + 30 * 60 * 1000;
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
      });
    }

    // Next upcoming booking (if any) so the page can show when to come back.
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

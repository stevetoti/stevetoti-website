import { NextRequest, NextResponse } from 'next/server';
import { meetingCookie, setTotiCookie, totiBackend, validHostKey } from '@/lib/toti-backend';
interface Booking { id: string; title: string | null; start_time: string; end_time: string | null; join_count: number | null }
export async function POST(request: NextRequest) {
  try {
    const { email, code, hostKey, room } = await request.json();
    if (hostKey !== undefined) {
      if (!validHostKey(hostKey)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
      const roomId = typeof room === 'string' && /^[a-zA-Z0-9-]{1,64}$/.test(room) ? room : 'discovery';
      const res = await totiBackend(request, 'meet-access', { action: 'host_session', eventId: roomId.replace(/^evt-/, '') }, { host: true });
      const data = await res.json();
      if (!res.ok || !data.meetingToken) return NextResponse.json({ error: 'Host session unavailable' }, { status: res.status >= 400 ? res.status : 502 });
      const response = NextResponse.json({ ok: true, host: true, room: roomId, name: 'Stephen', title: 'Meeting room' });
      setTotiCookie(response, meetingCookie, data.meetingToken, 7200);
      return response;
    }
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return NextResponse.json({ ok: false, reason: 'invalid_email' }, { status: 400 });
    // Prove email ownership before looking up or revealing any booking information.
    if (!code) {
      const sent = await totiBackend(request, 'otp', { action: 'send', email: cleanEmail });
      return NextResponse.json(sent.ok ? { ok: false, otpRequired: true } : { error: 'Could not send code; try again later' }, { status: sent.ok ? 200 : sent.status });
    }
    const verified = await totiBackend(request, 'otp', { action: 'verify', email: cleanEmail, code: String(code).trim() });
    const proof = await verified.json();
    if (!verified.ok || !proof.verified || !proof.verificationToken) return NextResponse.json({ ok: false, reason: 'bad_code' }, { status: verified.status >= 400 ? verified.status : 200 });
    const lookup = await totiBackend(request, 'meet-access', { action: 'lookup', email: cleanEmail, verificationToken: proof.verificationToken });
    const data = await lookup.json();
    if (!lookup.ok || !Array.isArray(data.bookings)) return NextResponse.json({ error: 'Lookup unavailable' }, { status: 502 });
    const rows: Booking[] = data.bookings;
    const now = Date.now();
    const active = rows.find(row => now >= Date.parse(row.start_time)-900000 && now <= (row.end_time ? Date.parse(row.end_time) : Date.parse(row.start_time)+1800000)+600000);
    if (active) {
      const joined = await totiBackend(request, 'meet-access', { action: 'consume_join', email: cleanEmail, eventId: active.id, verificationToken: proof.verificationToken });
      const access = await joined.json();
      if (!joined.ok || !access.meetingToken) return NextResponse.json({ ok: false, reason: 'join_limit' }, { status: joined.status >= 500 ? 502 : 200 });
      const response = NextResponse.json({ ok: true, room: `evt-${active.id}`, title: active.title || 'Discovery Call with Toti', start: active.start_time, end: active.end_time, name: '' });
      setTotiCookie(response, meetingCookie, access.meetingToken, 7200);
      return response;
    }
    const upcoming = rows.find(row => Date.parse(row.start_time) > now);
    return NextResponse.json(upcoming ? { ok: false, reason: 'not_yet', upcoming: { title: upcoming.title, start: upcoming.start_time, name: '' } } : { ok: false, reason: 'no_booking' });
  } catch {
    return NextResponse.json({ error: 'Verification unavailable' }, { status: 503 });
  }
}

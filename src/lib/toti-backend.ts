import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
export const meetingCookie = 'toti_meeting_access';
export const proofCookie = 'toti_email_proof';
export function setTotiCookie(response: NextResponse, name: string, token: string, seconds: number) {
  response.cookies.set(name, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api', maxAge: seconds });
}
export function validHostKey(input: unknown): boolean {
  const expected = process.env.MEET_HOST_KEY;
  if (typeof input !== 'string' || !expected || expected.length < 32) return false;
  const a = Buffer.from(input), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
export async function totiBackend(request: NextRequest, name: string, body: unknown, options: { meeting?: boolean; host?: boolean } = {}) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) return Response.json({ error: 'Origin not allowed' }, { status: 403 });
  const key = process.env.SUPABASE_TOTIROOM_ANON_KEY || process.env.TOTIROOM_SUPABASE_ANON_KEY;
  if (!key) return Response.json({ error: 'Service not configured' }, { status: 503 });
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` };
  if (options.meeting) {
    const token = request.cookies.get(meetingCookie)?.value;
    if (!token) return Response.json({ error: 'Verify meeting access first' }, { status: 401 });
    headers['x-toti-meeting'] = token;
  }
  if (options.host) {
    const serverKey = process.env.TOTI_WEBSITE_BACKEND_KEY;
    if (!serverKey) return Response.json({ error: 'Host integration not configured' }, { status: 503 });
    headers['x-toti-website'] = serverKey;
  }
  return fetch(`${process.env.TOTIROOM_SUPABASE_URL || 'https://rndegttgwtpkbjtvjgnc.supabase.co'}/functions/v1/${name}`, {
    method: 'POST', headers, body: JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(45000),
  });
}

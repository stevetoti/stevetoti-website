import { NextRequest, NextResponse } from 'next/server';
import { totiBackend } from '@/lib/toti-backend';
export async function POST(request: NextRequest) {
  try {
    const response = await totiBackend(request, 'meet-access', { action: 'channel' }, { meeting: true });
    return NextResponse.json(await response.json(), { status: response.status, headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Meeting connection unavailable' }, { status: 503 }); }
}

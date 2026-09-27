import { NextRequest, NextResponse } from 'next/server';
import { totiBackend } from '@/lib/toti-backend';
export async function POST(request: NextRequest) {
  try {
    const res = await totiBackend(request, 'meet-recap', await request.json(), { meeting: true });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch { return NextResponse.json({ error: 'Recap unavailable' }, { status: 503 }); }
}

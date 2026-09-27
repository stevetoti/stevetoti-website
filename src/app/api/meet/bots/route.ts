import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ error: 'External meeting bots are retired. Use the Toti meeting room.' }, { status: 410 });
}

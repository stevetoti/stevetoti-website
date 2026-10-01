import { NextResponse } from "next/server";

// Retired 2026-10-02: no page uses this endpoint any more, and it emailed the
// owner without any bot checks. Meetings are booked through /meet instead.
export function POST() {
  return NextResponse.json({ error: "This booking form is no longer available. Please use the contact page." }, { status: 410 });
}

# Changelog — stevetoti-website

## 2026-08-08 — [Claude Code] Ghana AI Summit award + Training landing page

- **Awards & Recognition section on /about**: new `AwardShowcase` component
  featuring the "AI Personality of the Year 2026" trophy (Ghana AI Summit &
  Awards) as the main image, with 4 event photos as thumbnails that open a
  full-screen lightbox carousel (keyboard nav, captions, thumbnail strip).
  Also added an award badge chip to the About hero and a 2026 timeline entry.
- **Image assets**: originals dropped in `public/Ghana AI Summit Images/`
  (2–3 MB each) were resized to 1920px / q80 web copies under
  `public/images/ghana-ai-summit/` (award-trophy, receiving-award,
  stage-celebration, team-celebration, winners-group). Originals moved out of
  `public/` to `assets-originals/` so they don't deploy.
- **/training landing page**: server page with SEO metadata + `TrainingClient`.
  Sections: hero (award credibility + program facts), Phase 1 / Phase 2 cards,
  full 6-month curriculum grid, region-tabbed pricing (Ghana GHS / Vanuatu VT /
  International USD — prices from the flyer PDFs), how-it-works, who-it's-for,
  CTA. Flyer PDFs downloadable from `public/downloads/training-flyer-*.pdf`.
- **Enrolment flow**: "Enrol Now" opens a modal form (name, email,
  phone/WhatsApp, payment preference, goals) → POST `/api/training-enroll`,
  which composes a message and reuses the existing Toti Room `contact-form`
  edge function (service: "1-on-1 Training Enrolment"). No payment is taken
  online yet — confirmation promises a discovery call + payment instructions.
- **Nav**: added Training link to Navbar and Footer (footer services link now
  points to /training instead of /services#training).
- Verified: `npm run build` clean (29 routes).
- **Deployed to production**: commit `6789f15` pushed to main, deployed via
  `npx vercel --prod` (deployment dpl_25dNSBjGAYNHZzF9g2juwnEjFBqW). Verified
  live on https://www.stevetoti.com — /training, /about, award images and all
  three flyer PDFs return 200; pricing and award content render correctly.
  No migrations or edge functions in this release.

## 2026-08-08 — [Claude Code] Award section on homepage + training hero image swap

- Homepage: `AwardShowcase` (same component as /about) now renders between
  `Hero` and `MeetToti`.
- /training hero + OG image switched from receiving-award.jpg to the
  award-trophy.jpg close-up.
- Deployed: commit `7ed1561`, verified live on www.stevetoti.com.

## 2026-08-09 — [Claude Code] Profile-photo favicon + Toti meeting-attendance verification

- Favicon: replaced default favicon.ico and added src/app/icon.png (512px) +
  apple-icon.png (180px) generated from steve-headshot.jpg. Commit `bfd484c`,
  deployed, verified live (favicon.ico + icon.png link tags serving).
- Verified/fixed the "will Toti join booked calls?" pipeline — root causes and
  fixes recorded in ~/Projects/totiroom/memory/changelog.md (Cal.com event
  used Cal Video so no bot dispatch; uuid-vs-string bug killed recall-bot
  insert). Live test booking for stevetoti1@gmail.com at 2026-08-09 00:30 UTC.

## 2026-08-08 — [Claude Code] Self-hosted Toti meeting room (/meet) replaces Zoom for discovery calls

Zoom + Recall + headless-Anam proved fragile for client-facing Toti calls
(black tile, no audio in live test). Built our own meeting room instead:
- /meet — branded lobby (camera preview, name) → multi-party video room.
  Humans connect over a WebRTC mesh (STUN only, 2–5 people); signaling +
  roster via Toti Room Supabase Realtime (broadcast + presence). The HOST
  (earliest joiner) owns the Anam Toti session, feeds it a WebAudio mix of
  every participant so Toti hears the whole room, and relays Toti's
  video/audio tracks to all peers. Toti greets the room on connect.
  Controls: mic/cam, copy link, leave, and "Call Stephen in" — emails Steve
  via Toti Room send-notification with the live meeting link (new
  /api/meet/summon route, 60s per-room throttle). Stephen can also just
  open the same room URL anytime to step into an ongoing meeting.
- /meet/booked — booking-confirmed page: countdown + Add to Google
  Calendar / Outlook / .ics download + join button. (Cal.com success
  redirect requires team plan, so this page is currently reachable
  directly; Cal's own email still carries calendar buttons.)
- Cal.com "Discovery Call with Toti" location switched to
  https://stevetoti.com/meet (link type). Zoom/Recall path remains for
  Toti joining Steve's real human meetings.

## 2026-08-08 — [Claude Code] Meeting room v2: booking-gated access + client-safe Toti brain

Fixes from Stephen's live test of /meet:
- "Steve my digital twin" bug: in clientMode the Anam session could route to
  the persona's custom (owner-mode) LLM, ignoring the client prompt.
  video-avatar v142 now omits llmId entirely in clientMode so Anam's standard
  LLM runs our client-safe prompt, and the prompt now carries meeting context
  (title + participant names, "none of them is Steve").
- Booking gate: /meet now opens on an email-verification step. New
  /api/meet/verify checks the confirmed Cal.com booking in Toti Room
  calendar_events; the room (evt-<id>) unlocks 15 min before start until
  10 min past end. Outside the window: shows their booking time. No booking:
  points to Toti chat to book. Host bypass via MEET_HOST_KEY (?key= URL
  param; key in Vercel env + scratchpad note) — Stephen can join any room,
  incl. ad-hoc ones.
- Summon email now contains Stephen's one-click host join link (room + key).
- Self-video bug fixed (stream attached after call view renders); camera is
  mandatory (no cam-off toggle; join blocked without camera).
- Toti greets by the verified attendee's name; "Call Stephen in" hidden for
  the host himself.

## 2026-08-08 — [Claude Code] OTP join gate for the meeting room

/api/meet/verify is now two-phase, reusing the Toti Room `otp` edge function:
phase 1 ({email}) sends a 6-digit code to the booking email and reveals
nothing (not even that a booking exists); phase 2 ({email, code}) proves
inbox ownership, then returns the private room (in-window) or the upcoming
booking details. UI adds the code-entry step with resend/change-email.
Host key path unchanged. Deployed + verified live (phase 1 returns
otpRequired and delivers a real code). Data fix: three stale
google-calendar-sync duplicates of cancelled Cal bookings were still
status=confirmed in calendar_events — marked cancelled. Test booking for
Monday 11:00 Vanuatu (uid f8FnwzYbyo1DzW2xwi3tFD, stevetoti1@gmail.com)
confirms the new Cal.com location (stevetoti.com/meet) flows end to end.

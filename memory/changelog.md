# Changelog — stevetoti-website

## 2026-08-30 — [Claude Code] SEO baseline: robots, sitemap, GA4, Search Console verification

- **`src/app/robots.ts`** (new): allow-all robots with `/admin`, `/api`, `/meet`
  disallowed (meet pages are already noindex); points to
  `https://stevetoti.com/sitemap.xml`.
- **`src/app/sitemap.ts`** (new): lists the 7 real public routes (`/`, `/about`,
  `/services`, `/portfolio`, `/training`, `/blog`, `/contact`). Blog post stubs
  in `blog/page.tsx` have no detail pages, so no `/blog/<slug>` entries yet —
  add them when real posts ship.
- **`src/components/GoogleAnalytics.tsx`** (new): env-driven GA4 (gtag via
  `next/script` afterInteractive). Renders nothing unless
  `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. Rendered from the root layout.
- **`src/app/layout.tsx`**: added `verification.google` metadata from
  `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. JSON-LD untouched.
- Env vars Stephen must set in Vercel: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  (GA4 `G-…` id), `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Search Console
  meta-tag token — optional if verifying via DNS).
- `npx tsc --noEmit` clean, `npm run build` clean (`/robots.txt` and
  `/sitemap.xml` now in the route table).

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

## 2026-08-08 — [Claude Code] CRITICAL: retired Claude model broke Toti's brain fleet-wide + chat UX fixes

Root cause of "chat gives generic answers": toti-concierge (and 4 more Toti
Room functions) still called claude-sonnet-4-20250514, retired by Anthropic
2026-06-15 → every call 404'd → website chat silently served the keyword
fallback in /api/chat since June. Swapped to claude-sonnet-5 (+ max_tokens
headroom for its adaptive thinking) and redeployed: toti-concierge v27,
chat v180, prepare-briefing v90, recall-bot v121, content-create v99.
Verified live — real knowledge-base answers are back.

Website fixes in the same pass:
- Chat links now clickable: new src/lib/linkify.tsx used in AnamChatWidget;
  AnamVideoAvatar's markdown renderer now converts [text](url) and bare URLs
  to styled <a> tags.
- /training hero CTA shows "Book Free Call" on mobile (full label ≥sm).
- AnamVideoAvatar now lazy-loads client-side via ClientWidgets wrapper
  (next/dynamic ssr:false) — out of the shared first-load bundle.
- Meeting context: booking notes (calendar_events.description) now flow
  verify → /meet → anam session → video-avatar prompt (v143), so Toti opens
  discovery calls knowing what the client asked for. Live test booking:
  "I want a pharmacy website" (uid giMRpb2EZiNb8harFNYecX).

## 2026-08-08 — [Claude Code] Meeting links expire after 2 joins

calendar_events.join_count (new column, migration meet_join_count) is
incremented on each successful OTP room grant in /api/meet/verify; at 2 the
booking returns reason "join_limit" and the UI shows an expired message with
a rebook prompt. Two joins so one accidental disconnect/refresh doesn't
lock a client out. Host key joins don't consume the allowance.

## 2026-08-08 — [Claude Code] Toti gets real email powers in meetings + proper introduction + client recap

- Root cause of "he said he sent the booking link but nothing came": the
  meeting brain had NO tools — it hallucinated the send. Now video-avatar
  v146 declares an Anam client tool send_email_to_participant; the /meet page
  handles it (new /api/meet/toti-action → send-notification v2 with
  linkLabel) and emails the verified participant — booking-link button
  included when asked. Toti's prompt: NEVER claim a send unless the tool
  returned success; report failures honestly.
- Introduction script per Stephen: Toti opens by putting the client at ease —
  he's Steve's assistant, Steve asked him to take this first meeting and
  will personally meet them after; mentions his work on Steve's tech videos
  and the Build Profit AI community (can share by email); then invites the
  client to introduce themselves and reassures them the team will help.
- meet-recap v2: recap email now ALSO goes to the participant (thanks +
  summary + book-with-Steve button); Steve still gets the full internal
  version with action items and decisions. Room passes attendeeEmail.

## 2026-08-08 — [Claude Code] Toti no longer gate-crashes meetings + host bot control

Stephen found Toti sitting in his own "Digi Assist AI Zoom Meeting" with no
way to eject him. Two fixes:
- recall-bot: auto-dispatch is now OPT-IN. The cron dispatcher only sends
  Toti to events whose title contains "toti", whose description contains
  "@toti", or with metadata.toti_join = true — and skips events hosted at
  stevetoti.com/meet (he's already there natively). Previously it dispatched
  to EVERY confirmed calendar_event with a meeting URL, including
  Google-Calendar-synced meetings of Steve's own.
- NEW /meet/bots?key=<MEET_HOST_KEY> (+ /api/meet/bots): host-only panel
  listing every meeting Toti is currently in with one-click Remove, plus a
  form to send Toti into any Zoom/Meet/Teams URL on demand (clientMode off —
  assistant mode for Steve's own meetings). Auto-refreshes every 20s.


## 2026-09-27 — [Codex] Approved backend compatibility work
Approved Toti Room compatibility hardening: OTP before booking lookup, atomic join result required, HTTP-only signed meeting/email-proof cookies, scoped host backend delegation, recipient-bound notifications, removed host credential from summon URLs. Local only; coordinated release required.
- Validation: Next.js production build + typecheck passed; `node scripts/test-meeting-access.cjs` passed 7 mocked admission scenarios without live service calls. These adapters remain local and require the coordinated Toti Room migration/function release and new credentials before deployment.

## 2026-09-27 — [Codex] Private meeting channel admission
- Added cookie-authenticated channel endpoint; client joins only backend-issued private topics, never predictable public room names. Removed peer-controlled principal assertions and URL-based host login; host uses password form. Matching Supabase migration/function changes are required before release.

- Stephen confirmed native meeting room only: removed external bot controls and URL-key login from the bot page; its API returns 410. No external bot requests are made.

## 2026-09-27 — [Codex] Patched framework upgrade
- Audit found critical Next.js 14 advisories. Applied official async-request codemod (no changes required), upgraded to Next.js 15.5.26 / React 19 and compatible types, and patched transitive packages. PostCSS override keeps Next.js's pinned copy on patched 8.5.x. npm audit now reports zero vulnerabilities.


## 2026-09-28 — [Codex] Production release complete; verification boundaries
- Toti Room is READY at https://totiroom.pacificwavedigital.com from 0f62aea02cad39a7d4ae32abd3c7f36854e90a19, deployment dpl_4R9cKXQ5ckppLbv6iw3a8anH234g. Canonical alias independently verified. Initial 94890cd deployment was canceled by legacy docs-only ignore logic; fixed production builds to always run.
- Companion is READY at https://www.stevetoti.com from c4fc98f800addb7ae79fa955d3229ceea1fc215c, deployment dpl_7ushUQGG8iuPUkJtWELkhkp52vGe.
- All six 20260927 migrations recorded; all 35 explicitly named Toti Edge Functions deployed. Verified one owner, private video buckets, Recall cron disabled. Owner ElevenLabs auth enabled and verified; LiveAvatar dedicated key/configuration completed with explicit consent.
- Live checks passed: anonymous private endpoints 401; private tables zero anonymous rows; missing meeting cookies 401; wrong host password 401; valid host sign-in 200; Secure/HttpOnly cookie; signed channel issuance 200; admitted private Realtime topic SUBSCRIBED and guessed topic CHANNEL_ERROR; retired website bot route 410; authenticated owner LLM completion 200. Synthetic meeting channel removed after testing.
- Browser: production /auth renders correctly with no console errors. No owner password was used; authenticated dashboard UI, GitHub row, real microphone/video, guest OTP/booking and actual email-alert receipt still need end-to-end acceptance.
- Service smoke using the Management API legacy service key returned 401; its hash differs from the function runtime service-key digest. Did not weaken authentication or rotate shared keys. Native signed meeting flow and owner LLM internal backend flow passed. GitHub/health/voice service-level checks are not claimed as passed; follow up through owner session and reconcile managed key metadata if needed.
- Removed the exact obsolete exposed deployment dpl_Fch1KjeMXfDYgJziKeSzs3XTbYxD (DELETE HTTP 200) after replacement verification. Original GitHub token revocation completion remains unverified; no exposed-token probing performed.
- Paid PITR remains OFF by Stephen's decision. Daily backups do not meet the few-minute recovery objective; object-storage backup coverage and full restore drill remain unresolved.

## 2026-09-28 — [Codex] Shorter training programmes and mentorship
Updated programme copy to 6 weeks per phase / 3 months full programme, added Phase 1 affiliate marketing and 3 months of needs-based post-training mentorship. Prices and existing monthly payment amounts retained; 3 sessions/week implies 18 per phase, 36 full. Flyers and verification pending.

- Stephen confirmed 90-minute sessions, three weekly. Updated hero, curriculum, process and flyers accordingly. Lint clean; final production build passed; generated training HTML verified for all revised offer details. All three one-page PDFs rendered and inspected; extracted text verified for 18/36 sessions, 90-minute cadence, affiliate marketing and mentorship. Existing meeting-access regression passed.

## 2026-09-28 — [Codex] Revised training offer deployed
Production READY: dpl_AhSdqvZwtw5Ld3piHKFyBV2tBBMf from 6210b54b949f0c2342cd64f9786e63db2f88eb0a. Verified https://www.stevetoti.com/training HTTP 200 and rendered shorter durations, 90-minute sessions, affiliate marketing and three-month mentorship. All three public regional PDF downloads exactly match the visually verified local files (SHA-256). Browser tool timed out twice; interactive region/enrolment flow not re-tested and no enrolment submitted. Prices unchanged.

## 2026-09-28 — [Codex] Toti portrait in public chat
Replaced generic chat launcher/header icons in the active AnamVideoAvatar widget with the existing /images/toti-avatar.jpg portrait used by MeetToti. Added the same portrait beside assistant replies, with fixed dimensions and an accessible launcher label. No image alteration or provider/avatar configuration change.

- Lint and production build passed. Compiled active widget contains three references to the existing portrait plus the accessible launcher label. Source image inspected; no image editing required.

## 2026-09-29 — [Codex] Chat portrait deployed
Production READY: dpl_DUhbECwCTAuMmwKH8ogDMYCWfwXF from 2ea83c420d749d423b5335cf06d7a0d16fd532a2. Live active chat chunk verified with three portrait references (launcher/header/assistant messages); published image hash matches the existing Meet Toti headshot. Lint and production build passed.

## 2026-09-29 — [Codex] Original Toti portrait quality
Replaced website portrait references with the user-supplied original PNG, copied byte-for-byte from Toti Room public/Toti Digital Assistant Profile Photo.png. Set Next Image unoptimized for these portraits to avoid compression/downsampling; new URL avoids stale optimised-image caches. Applies to active chat, legacy chat and Meet Toti.

- Validation: copied PNG hash equals supplied file; lint and production build passed; active compiled widget references original PNG in all three positions with optimisation bypass enabled.

## 2026-09-29 — [Codex] Original portrait live
Production READY: dpl_AcCaQvxuCyMZdQNkew3sDq8RV67G from 6c24dd3fbcc01656e0a79ebe3b97a5db891812c5. Live PNG SHA-256 equals Stephen's supplied original; live widget references new PNG in all three positions with image optimisation bypass enabled. No generative editing or upscaling performed.

## 2026-09-29 — [Claude Code] Recommended tools / affiliate page
- **Public `/tools`** (`src/app/tools/`): hero (generated Pacific workspace image + headshot), filterable tool cards (clickable website screenshot, name, tagline, description, domain, CTA), two image content sections, "why trust these picks" with the award photo, CTA, affiliate disclosure. ISR 60s; admin saves revalidate instantly.
- **`/go/[slug]`**: logs a click (skips bots) to `affiliate_clicks` via `after()`, then 302s to the affiliate URL; unknown/hidden slugs fall back to `/tools`. Disallowed in robots.
- **`/admin/tools`** + `/api/admin/tools` (+ `/upload` to Toti Room `site-assets/affiliate-tools/`): add/edit/hide/highlight/reorder/delete tools, image upload or URL, copy short link, 30-day + total clicks.
- Data: Toti Room migration `20260929000100_affiliate_tools.sql` (applied). Seeded Hostinger, Namecheap, DigiAssist AI. Images in `public/images/tools/`.
- Fixes found while testing: admin login rejected the real password because the Vercel `ADMIN_PASSWORD` value has a trailing newline (login now compares trimmed; token signing unchanged); admin pages sat under the fixed site navbar (content/sidebar offset); navbar CTA hover overlay was unclipped (orange block) and CTA overflowed at tablet widths.
- Nav/footer/sitemap gain Tools.
- Verified locally on a production build with production env: tsc, lint, build clean; desktop/mobile screenshots; all three /go redirects; full admin E2E in Chromium (login incl. wrong password, add + upload, public render, image click opens affiliate in new tab, click counted, edit, hide, duplicate-slug error, delete); anon RLS denies click reads and all writes. Test rows/uploads removed.

## 2026-09-29 — [Claude Code] Tools page deployed
Production READY: dpl_9wLfwcoTNAF5XUcV49UH5iGoYabm from 8fcaa9e (Toti Room migration commit 8e75cf5, applied before deploy). Verified on https://www.stevetoti.com: /tools 200 with all three tools; /go/hostinger, /go/namecheap, /go/digiassistai 302 to the exact affiliate URLs; robots/sitemap updated; wrong admin password 401; full admin E2E against live (login with real password, add + image upload, public render, image click → affiliate in new tab, click counted, edit, hide, duplicate-slug error, delete). QA rows, verification clicks and test upload removed.

## 2026-09-30 — [Claude Code] Tools page: Indonesia, company badge, four new tools
- Hero copy now lists Vanuatu, Ghana, the USA and Indonesia; badge reads "3 companies · 4 countries"; disclosure says "including products from my own companies".
- DigiAssist AI badge "Built by me" → "My company" (Stephen's request); description credits Global Digital Prime. Admin checkbox relabelled "My company's product".
- Added via data (no schema change): Higgsfield (affiliate), ChatGPT Codex (official link, no affiliate), Wise (invite link), Payoneer (official link until Stephen supplies a referral link). New category "Money Transfers". Screenshots in public/images/tools/.

## 2026-09-30 — [Claude Code] Namecheap affiliate link updated
- Data change only: namecheap affiliate_url → https://namecheap.pxf.io/c/2427860/4055573/5618 (Impact tracking link; currently lands on Namecheap's hosting birthday promo page). Live /go/namecheap verified.
- Replaced with https://namecheap.pxf.io/P0bk3z (lands on Namecheap homepage with tracking) at Stephen's request; previous link went to a promo page.

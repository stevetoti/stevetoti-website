# Todo — stevetoti-website

## 2026-09-30 — [Claude Code] Form bot defence

- [x] Guard `/api/contact` + form; flags in email; anon insert policy dropped.
- [x] Hostnames added; deployed `stevetoti-website-4lv5bfv5o`; live probes pass. — [Claude Code] 2026-10-01
- [ ] **Stephen:** send one real enquiry from https://www.stevetoti.com/contact and confirm the email arrives.
- [ ] Follow-up: the `contact-form` Edge Function is still callable with the anon key (server-side only today); add the Deno guard from the skill or a shared secret when Codex finishes the security branch.

## High priority
- [ ] Decide payment provider(s) for training: Stripe Payment Links (USD tier
      via Global Digital Prime US entity), Paystack/Flutterwave for Ghana
      Mobile Money, manual invoice for Vanuatu. Then wire "pay now" buttons
      into the pricing cards (`stripeLink`-style field per package).
- [ ] Deploy the award + training update to production and verify live.

## Nice to have
- [ ] Add award mention to homepage (Hero or AboutPreview credibility strip).
- [ ] Training testimonials section once first students complete.
- [ ] Auto-detect visitor region for the pricing tab default (currently
      defaults to International).


## 2026-09-27 — [Codex] Approved backend compatibility work
- [ ] Configure TOTI_WEBSITE_BACKEND_KEY in both services and a >=32-character MEET_HOST_KEY; rotate old URL-exposed host key.
- [ ] Coordinate Toti Room backend/migrations release; run authenticated booking/meeting/recap/notification and host-control tests.
- [ ] Review meeting media/signalling admission enforcement before production sign-off.


## 2026-09-28 — [Codex] Meeting security release live
- [x] Production deployment dpl_7ushUQGG8iuPUkJtWELkhkp52vGe READY; native host sign-in and private channel admission verified.
- [ ] Complete real guest OTP/booking, audio/video and recap acceptance with Stephen. Paid recovery remains deferred.

## 2026-09-28 — [Codex] Shorter training programmes and mentorship
- [x] Update regional flyers, verify the training page and deploy the revised offer. — [Codex] 2026-09-28: production READY, live content and PDF file hashes verified; browser interaction checks unavailable due to tool timeout.

## 2026-09-28 — [Codex] Toti portrait in public chat
- [x] Verify and deploy the public chat portrait update. — [Codex] 2026-09-29: production READY; live chat bundle and image verified.
- [ ] Follow up on pre-existing raw HTML rendering in AnamVideoAvatar assistant messages; this portrait-only change does not address that rendering path.

## 2026-09-29 — [Codex] Original Toti portrait quality
- [x] Verify and deploy original PNG portrait replacement. — [Codex] 2026-09-29: READY, live file hash and chat references verified.

## 2026-09-29 — [Claude Code] Tools page
- [ ] Stephen: add Wise, Payoneer and other tools at /admin/tools (image upload or paste image link).
- [ ] Re-save `ADMIN_PASSWORD`, `TOTIROOM_SUPABASE_URL` and the Supabase keys in Vercel without the trailing newline (code tolerates it, but it's a trap).
- [ ] Existing `/api/admin/data` PATCH/DELETE accept any table name and it reads `TOTIROOM_SUPABASE_SERVICE_KEY` (not set; prod has `SUPABASE_TOTIROOM_SERVICE_KEY`), so it silently falls back to the anon key. Review.
- [ ] Stephen: paste Payoneer referral link (and a Codex/ChatGPT referral if one exists) in /admin/tools; both currently use the official site link.

## 2026-10-02 — [Claude Code] Form defence follow-ups (hand to Codex / skill owner)
- [ ] Drop anon INSERT policies the site no longer needs: `toti_chat_sessions` (lead now uses service key), `newsletter_subscribers` (if any). Check `toti_chat_messages` / chat-session route first.
- [ ] Guard the `contact-form` and `send-notification` Edge Functions (shared secret or Deno form-guard) so they can't be called directly with the public anon key.
- [ ] Newsletter double opt-in (confirmation email) before marking `active`.
- [ ] Rate-limit `/api/anam/session` and `/api/chat` (paid AI calls) per IP.

## 2026-10-05 — [Codex] Video library and guides
[ ] Finish locked dependency installation and type/lint/build validation; verify responsive library and PDF links. Upload approved Steve/BPAI masters, bind verified YouTube IDs, commit/push/deploy, then publish hidden JoggAI listing and verify live links.

## 2026-10-05 — [Codex] Video library release verified
[x] Finish validation, bind both uploaded IDs, deploy library/PDFs and publish JoggAI — [Codex] 2026-10-05. [ ] Replace JoggAI official destination in /admin/tools when Stephen supplies approved affiliate link. YouTube BPAI thumbnail permission follow-up tracked in BuildProfitAI memory.


## 2026-10-05 — [Codex] Newsletter guide access and tool labels
- [x] Deploy newsletter guide access and neutral tools badges. — [Codex] 2026-10-05: released dcbde1e, deployment dpl_9tMeGpQBeo7nPexGs6XUACvkdsog. Build/type/lint, focused signup tests and live signed PDFs/403/404 checks passed.

## 2026-10-05 — [Codex] Embedded YouTube login loop
- [x] Verify and release direct YouTube fallback links for both lessons. — [Codex] 2026-10-05: 1b284f6 deployed, live links verified; both direct YouTube videos played signed out. Embedded loop not claimed resolved.

## 2026-10-08 — [Codex] BPAI resource lesson
- [ ] Verify and deploy new BPAI resource lesson and protected PDF; no new newsletter contact or email send needed.

- [x] [Codex] 2026-10-08: Approved BPAI resource lesson and protected PDF deployed and verified; version date corrected to8October.

## 2026-10-10 — [Codex] Steve quality-check lesson
- [ ] Validate and release the approved Steve quality-check lesson and PDF.

- [x] [Codex] 2026-10-10: Approved Steve quality-check lesson and PDF deployed and verified.

- [x] [Codex] 2026-10-14: Add WordPress and Elementor tool cards and verify public cards/redirects.
- [ ] [Codex] 2026-10-14: After Stephen approves expanded Elementor master and a real YouTube ID exists, publish its library page with matching workbook using existing gated flow.

## 2026-10-14 — [Codex] Approved complete Elementor lesson
Added elementor-homepage-build with actual Steve YouTubeIDYQi-bVKshTA,17:59duration,matching7pageprivatePDF,thumbnail and realsteps. Existing guardedguide-download/consentflows preserved. Validation/productionreleasepending;YouTubestagedprivateuntilbothlibrarieslive.

- [x] [Codex] 2026-10-14: Approved complete Elementor lesson/video/workbook live and verified. No publishing work remains for this episode.

2026-10-15 — [Codex]: Release/verify approved Digi Assist lesson and protected workbook on the existing library; no new player or signup flow.

- [x] Replace removed DigiAssistYouTubeIDuq8aQICCt7s after BPAI phone verification and guardedrecovery; deploy/verify correctepisode andmatchedprivatePDF. — [Codex]2026-10-15: releasedyzfvQ8m4ZJk; downloadsverified; personalembeddedloadingfollowupnoted. — [Codex]2026-10-15: productionheld, previewREADY, all localchecks pass.

— [Codex]2026-10-15: phoneverificationcomplete; recoveredvideoyzfvQ8m4ZJk replaces removedupload; verifyproductionrelease below.

## 2026-10-16 — [Codex] Recoverable YouTube lesson player
Stephen authorises fixing personal library playback. Replaced automatic iframe loading with an explicit thumbnail/Play lesson action, official YouTube API readiness/error monitoring, bounded loading state and Reload video control. Playback stays on YouTube; privacy-enhanced host and direct fallback retained. No signup or guide-flow changes. Browser/deployed acceptance pending.

- [x] Fix blank personal lesson player; deploy and verify real guest playback, Reload video and cold reload. — [Codex]2026-10-16:e058cfd/dpl_3Ew1oQbk8ghTVSEsKHqyGhDaEwDA.
- [ ] Finish optional phone/second-lesson playback acceptance once CUAbrowserconnectionrecovers. — [Codex]2026-10-16: primarylessonplay/retry/coldreloadpassed; nofakepassforblockedchecks.

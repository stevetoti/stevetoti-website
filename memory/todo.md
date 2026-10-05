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

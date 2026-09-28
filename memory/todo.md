# Todo — stevetoti-website

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

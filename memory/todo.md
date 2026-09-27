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

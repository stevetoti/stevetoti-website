# Decisions — stevetoti-website

## 2026-08-08 — [Claude Code] Training payments: enrolment form first, Stripe later

**Context:** Training page needs a purchase path. Stephen asked whether to
charge with Stripe directly or have students select a course and contact him.

**Decision:** Launch with an enrolment-request flow (modal form →
`/api/training-enroll` → contact-form edge function) instead of direct Stripe
checkout. Pricing data in `TrainingClient.tsx` is structured per region so a
`stripeLink` field can be added to each package later.

**Reason:** (1) The program itself requires a free discovery call to confirm
fit before enrolment, so payment-before-contact contradicts the funnel.
(2) Ghana students typically pay by Mobile Money (Paystack/Flutterwave
territory — Stripe has no Ghana merchant support), and Vanuatu Vatu support is
limited; Stripe fits best only for the USD/international tier. (3) High-ticket
1-on-1 offers convert better with a human touchpoint. Stripe Payment Links for
the USD tier can be added as an optional "pay now" after the call flow proves
out.

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


## 2026-09-27 — [Codex] Approved backend compatibility work
Public proxies do not receive a service-role key. Dedicated TOTI_WEBSITE_BACKEND_KEY only delegates host meeting controls; participant operations use signed, short-lived meeting proofs. Only Stephen may access private Toti operations.

## 2026-09-28 — [Codex] Shorter training programmes and mentorship
Stephen requested halving training duration and adding affiliate marketing to the first phase. Mentorship lasts 3 months after the chosen programme and is tailored to needs/progress towards income goals; no guaranteed income or indefinite support promise. Retain existing prices and 3-session weekly cadence unless Stephen specifies otherwise.

- [Codex] 2026-09-28: Stephen confirmed 90 minutes per session, three sessions weekly. 18 sessions / 27 teaching hours per phase; 36 sessions / 54 teaching hours for both phases.

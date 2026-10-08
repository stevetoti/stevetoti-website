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

## 2026-09-28 — [Codex] Toti portrait in public chat
Use the existing white-shirt/blue-tie Toti portrait consistently in the public chat launcher, header and assistant messages. Keep the AI assistant label.

## 2026-09-29 — [Codex] Original Toti portrait quality
Use Stephen's supplied original Toti PNG without image editing or generative enhancement. Serve the modest 148 KB file directly for consistent portrait quality.

## 2026-09-29 — [Claude Code] Affiliate tools live in the database, managed from stevetoti.com/admin
**Context:** Stephen wants a public tools page with affiliate links he can keep adding to (Hostinger, Namecheap, DigiAssist AI first; Wise, Payoneer next).
**Decision:** Store tools in Toti Room Supabase (`affiliate_tools`, `affiliate_clicks`), manage them from the existing password-protected `/admin/tools`, and route every outbound link through `/go/<slug>`.
**Reason:** No redeploy to add a tool; stable short links survive affiliate-URL changes; first-party click stats. Admin reuses the site's existing auth and service-key pattern instead of adding a second admin in Toti Room. Anon RLS exposes only published tools.

## 2026-10-05 — [Codex] Video library and guides
Use typed local episode content for the first two lessons, reuse existing affiliate_tools slugs and /go redirects, and serve downloadable PDF companions from public/downloads/videos. Stephen explicitly authorises library release and YouTube publication of Steve v3 and BPAI v2; Vows drafts excluded. JoggAI uses official URL until affiliate approval.

## 2026-10-05 — [Codex] Video library release verified
Release uses the existing website deployment project/account, existing affiliate_tools admin and redirects. JoggAI official URL was explicitly selected by Stephen pending affiliate approval; no invented tracking code. Episode pages reference the catalogue rather than duplicating affiliate URLs.


## 2026-10-05 — [Codex] Newsletter guide access and tool labels
User requested newsletter signup before guide downloads and neutral tool badges. Public My company badges display Featured; internal ownership and introductory ownership disclosure remain. Existing newsletter bot/rate guards remain enforced.

## 2026-10-05 — [Codex] Embedded YouTube login loop
Keep YouTube hosting and embeds. Provide a direct exact-video fallback for embedded sign-in loops; do not claim YouTube security challenges can be disabled or that a fallback fixes every browser.

## 2026-10-06 — [Claude Code] /training redirects to BPAI
- **Context:** BuildProfitAI is now the single home for Stephen's personal training (one USD price, PWD keeps Vanuatu organisations/government).
- **Decision:** Temporary redirect `/training` → buildprofitai.com/training-center rather than deleting the page.
- **Reason:** existing video outros and links keep working; easy to reverse. Note: video outro standard (BuildProfitAI CLAUDE.md) references stevetoti.com → Training + Toti chat; future outros should show the BPAI Training Centre instead.

## 2026-10-08 — [Codex] BPAI resource lesson
Reuse existing YouTube embed/direct-link and explicit newsletter-consent guide flow for the approved BPAI resource episode. Keep video hosted on YouTube.

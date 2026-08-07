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

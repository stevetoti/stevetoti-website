# Steve Totimeh website

Inherits `../CLAUDE.md`. Next.js 15.5 / React 19 / TypeScript. Read `memory/` before changes. The public meeting and chat routes depend on Toti Room Supabase functions; release their authentication contracts together. Verify → commit → push → deploy; never deploy uncommitted work.

## Video lessons and guides — 2026-10-05 [Codex]
`/videos` and `/videos/[slug]` use typed entries in `src/lib/video-library.ts`. Each entry binds the actual YouTube video ID, channel, final-video chapters, step-by-step instructions, an image and PDF under `private/video-guides/` (served by signed one-hour links after guarded newsletter signup). Keep PDFs matched to the approved final edit. Related tools use existing affiliate_tools slugs and /go redirects; never duplicate affiliate destinations in guide content. JoggAI uses the official URL until Stephen replaces it in /admin/tools after affiliate approval. Never deploy an episode with a missing YouTube ID or a nonexistent PDF.

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { loadYouTubeApi, type YouTubePlayer } from "@/lib/youtube-player";

type PlayerStatus = "idle" | "loading" | "ready" | "unavailable";
interface Props { videoId: string; title: string; image: string; }

export default function YouTubeLessonPlayer({ videoId, title, image }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!attempt || !mount.current) return;
    const container = mount.current;
    let cancelled = false;
    let player: YouTubePlayer | undefined;
    const timeout = window.setTimeout(() => {
      if (!cancelled) setStatus("unavailable");
    }, 18000);
    const iframe = document.createElement("iframe");
    const parameters = new URLSearchParams({ rel: "0", autoplay: "1", playsinline: "1", enablejsapi: "1", origin: window.location.origin });
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${parameters}`;
    iframe.title = title;
    iframe.className = "absolute inset-0 h-full w-full";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    container.appendChild(iframe);
    loadYouTubeApi().then(api => {
      if (cancelled) return;
      player = new api.Player(iframe, { events: {
        onReady: () => { if (!cancelled) { window.clearTimeout(timeout); setStatus("ready"); } },
        onStateChange: event => { if (!cancelled && event.data === 1) { window.clearTimeout(timeout); setStatus("ready"); } },
        onError: () => { if (!cancelled) { window.clearTimeout(timeout); setStatus("unavailable"); } },
      } });
    }).catch(() => { if (!cancelled) { window.clearTimeout(timeout); setStatus("unavailable"); } });
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      player?.destroy();
      container.replaceChildren();
    };
  }, [attempt, videoId, title]);

  function start() { setStatus("loading"); setAttempt(value => value + 1); }

  return <section aria-label="Lesson video" className="mt-8">
    <div className="relative aspect-video min-h-[200px] overflow-hidden rounded-2xl border border-white/10 bg-black">
      {attempt === 0 ? <button type="button" onClick={start} aria-label={`Play lesson: ${title}`} className="group absolute inset-0 w-full focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-vibrantorange">
        <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" priority />
        <span className="absolute inset-0 bg-black/25 group-hover:bg-black/10" />
        <span className="absolute inset-0 flex items-center justify-center"><span className="rounded-full bg-vibrantorange px-6 py-4 text-lg font-bold text-black shadow-lg">▶ Play lesson</span></span>
      </button> : <div ref={mount} className="absolute inset-0" />}
    </div>
    <div aria-live="polite" className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-300">
      {status === "loading" && <p role="status">Loading your video…</p>}
      {status === "unavailable" && <p role="status">The player hasn’t responded. Try again, or use the YouTube link below.</p>}
      {attempt > 0 && <button type="button" onClick={start} className="rounded-lg border border-white/30 px-3 py-2 hover:border-vibrantorange focus-visible:outline focus-visible:outline-2 focus-visible:outline-vibrantorange">Reload video</button>}
    </div>
  </section>;
}

export interface YouTubePlayer { destroy(): void; }
interface PlayerEvents { onReady(): void; onStateChange(event: { data: number }): void; onError(): void; }
export interface YouTubeApi { Player: new (element: HTMLIFrameElement, options: { events: PlayerEvents }) => YouTubePlayer; }
declare global { interface Window { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void; } }
let pending: Promise<YouTubeApi> | undefined;

/** Load the official API only after a viewer asks to play; failed requests remain retryable. */
export function loadYouTubeApi(): Promise<YouTubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (pending) return pending;
  pending = new Promise<YouTubeApi>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    const cleanup = () => {
      window.clearTimeout(timer);
      if (window.onYouTubeIframeAPIReady === ready) window.onYouTubeIframeAPIReady = previous;
    };
    const fail = () => { cleanup(); script.remove(); pending = undefined; reject(new Error("YouTube player API did not load")); };
    const ready = () => {
      cleanup();
      try { previous?.(); } finally {
        if (window.YT?.Player) resolve(window.YT);
        else { script.remove(); pending = undefined; reject(new Error("YouTube player API unavailable")); }
      }
    };
    const timer = window.setTimeout(fail, 12000);
    window.onYouTubeIframeAPIReady = ready;
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return pending;
}

"use client";

/**
 * Booking-confirmed page. Cal.com redirects here after a successful booking
 * (with booking params forwarded). Shows the meeting details, a countdown,
 * and one-click Add-to-Calendar buttons (Google / Outlook / .ics download).
 */

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CalendarPlus,
  CheckCircle,
  Clock,
  Download,
  Link2,
  Check,
  Video,
  Loader2,
} from "lucide-react";

const MEET_URL = "https://stevetoti.com/meet";

function toCalDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function BookedContent() {
  const params = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Cal.com forwards booking fields on redirect; be tolerant about names.
  const title = params.get("title") || "Discovery Call with Toti";
  const attendee = params.get("attendeeName") || params.get("name") || "";
  const startRaw = params.get("startTime") || params.get("start") || "";
  const endRaw = params.get("endTime") || params.get("end") || "";

  const start = useMemo(() => (startRaw ? new Date(startRaw) : null), [startRaw]);
  const end = useMemo(() => {
    if (endRaw) return new Date(endRaw);
    if (start) return new Date(start.getTime() + 30 * 60 * 1000);
    return null;
  }, [endRaw, start]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const details =
    "Your discovery call with Toti, Stephen Totimeh's AI assistant. " +
    `Join here at the scheduled time: ${MEET_URL} — Toti will greet you in the room.`;

  const googleUrl =
    start && end
      ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          title
        )}&dates=${toCalDate(start)}/${toCalDate(end)}&details=${encodeURIComponent(
          details
        )}&location=${encodeURIComponent(MEET_URL)}`
      : null;

  const outlookUrl =
    start && end
      ? `https://outlook.live.com/calendar/0/action/compose?rru=addevent&subject=${encodeURIComponent(
          title
        )}&startdt=${encodeURIComponent(start.toISOString())}&enddt=${encodeURIComponent(
          end.toISOString()
        )}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(MEET_URL)}`
      : null;

  const downloadIcs = () => {
    if (!start || !end) return;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//stevetoti.com//meet//EN",
      "BEGIN:VEVENT",
      `UID:${crypto.randomUUID()}@stevetoti.com`,
      `DTSTAMP:${toCalDate(new Date())}`,
      `DTSTART:${toCalDate(start)}`,
      `DTEND:${toCalDate(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details.replace(/,/g, "\\,")}`,
      `LOCATION:${MEET_URL}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "discovery-call-with-toti.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(MEET_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const minutesUntil = start ? Math.round((start.getTime() - now) / 60000) : null;
  const startsSoon = minutesUntil !== null && minutesUntil <= 10;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <CheckCircle size={36} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {attendee ? `You're booked, ${attendee.split(" ")[0]}!` : "You're booked!"}
          </h1>
          <p className="text-gray-400">{title}</p>
        </div>

        <div className="glass-card p-6 md:p-8">
          {start ? (
            <div className="flex items-start gap-3 mb-6">
              <Clock size={20} className="text-vibrantorange mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">
                  {start.toLocaleString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-gray-500 text-sm">
                  {minutesUntil !== null && minutesUntil > 0
                    ? `Starts in ${minutesUntil >= 60 ? `${Math.floor(minutesUntil / 60)}h ${minutesUntil % 60}m` : `${minutesUntil} minutes`} — shown in your local time`
                    : "Starting now — join below"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 mb-6">
              Your booking is confirmed — check your email for the details.
            </p>
          )}

          {/* Add to calendar */}
          <p className="text-sm text-gray-400 mb-3 font-medium">Add to your calendar</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <a
              href={googleUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!googleUrl}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                googleUrl
                  ? "bg-white/5 border-white/10 text-white hover:border-vibrantorange/60"
                  : "bg-white/5 border-white/5 text-gray-600 pointer-events-none"
              }`}
            >
              <CalendarPlus size={16} className="text-vibrantorange" /> Google
            </a>
            <a
              href={outlookUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!outlookUrl}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                outlookUrl
                  ? "bg-white/5 border-white/10 text-white hover:border-vibrantorange/60"
                  : "bg-white/5 border-white/5 text-gray-600 pointer-events-none"
              }`}
            >
              <CalendarPlus size={16} className="text-vibrantorange" /> Outlook
            </a>
            <button
              onClick={downloadIcs}
              disabled={!start}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:border-vibrantorange/60 transition-colors disabled:text-gray-600 disabled:pointer-events-none"
            >
              <Download size={16} className="text-vibrantorange" /> .ics file
            </button>
          </div>

          {/* Meeting link */}
          <p className="text-sm text-gray-400 mb-3 font-medium">Your meeting room</p>
          <div className="flex gap-2">
            <Link
              href="/meet"
              className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                startsSoon
                  ? "bg-gradient-to-r from-vibrantorange to-orange-500 text-white hover:shadow-lg hover:shadow-vibrantorange/30"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Video size={18} />
              {startsSoon ? "Join the meeting now" : "Open meeting room"}
            </Link>
            <button
              onClick={copyLink}
              className="px-4 rounded-xl bg-white/5 border border-white/10 text-white hover:border-vibrantorange/60 transition-colors"
              aria-label="Copy meeting link"
            >
              {copied ? <Check size={18} className="text-emerald-400" /> : <Link2 size={18} />}
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-4 flex items-center gap-1.5">
            <Video size={12} />
            Toti, Stephen&apos;s AI assistant, greets you in the room — video and voice, right in
            your browser. No downloads needed.
          </p>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          A confirmation email with these details is on its way to your inbox.
        </p>
      </div>
    </div>
  );
}

export default function BookedClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-vibrantorange" />
        </div>
      }
    >
      <BookedContent />
    </Suspense>
  );
}

"use client";

/**
 * Host-only control panel for Toti's meeting bots.
 * Open with ?key=<MEET_HOST_KEY>. Lets Stephen see which meetings Toti is in,
 * pull him out of any call instantly, and send him into a meeting on demand.
 */

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, LogOut, Send, RefreshCw, Bot, ShieldAlert } from "lucide-react";

interface BotRow {
  id: string;
  title?: string;
  url?: string;
  platform?: string;
  status?: string;
  joinedAt?: string | null;
  createdAt?: string;
}

function BotsPanel() {
  const params = useSearchParams();
  const hostKey = params.get("key") || "";

  const [bots, setBots] = useState<BotRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const call = useCallback(
    async (body: Record<string, unknown>) => {
      const res = await fetch("/api/meet/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostKey, ...body }),
      });
      return { ok: res.ok, data: await res.json() };
    },
    [hostKey]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { ok, data } = await call({ action: "list" });
    if (!ok) setError(data.error === "Unauthorized" ? "unauthorized" : data.error || "Failed to load");
    else setBots(data.bots || []);
    setLoading(false);
  }, [call]);

  useEffect(() => {
    if (hostKey) refresh();
    else {
      setLoading(false);
      setError("unauthorized");
    }
  }, [hostKey, refresh]);

  // Keep the list fresh while the page is open.
  useEffect(() => {
    if (!hostKey || error === "unauthorized") return;
    const t = setInterval(refresh, 20000);
    return () => clearInterval(t);
  }, [hostKey, error, refresh]);

  const remove = async (id: string) => {
    setRemoving(id);
    const { ok, data } = await call({ action: "remove", botId: id });
    setNotice(ok ? "Toti has left that meeting." : `Couldn't remove: ${data.error || "error"}`);
    setRemoving(null);
    refresh();
    setTimeout(() => setNotice(null), 5000);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingUrl.trim()) return;
    setSending(true);
    const { ok, data } = await call({
      action: "send",
      meetingUrl: meetingUrl.trim(),
      meetingTitle: meetingTitle.trim() || undefined,
    });
    setNotice(ok ? "Toti is joining that meeting now." : `Couldn't send Toti: ${data.error || "error"}`);
    if (ok) {
      setMeetingUrl("");
      setMeetingTitle("");
    }
    setSending(false);
    refresh();
    setTimeout(() => setNotice(null), 6000);
  };

  if (error === "unauthorized") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <ShieldAlert size={36} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Host access only</h1>
          <p className="text-gray-400 text-sm">
            Open this page with your host key to manage Toti&apos;s meetings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bot size={22} className="text-vibrantorange" /> Toti&apos;s meetings
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Meetings Toti is currently in. Remove him any time.
            </p>
          </div>
          <button
            onClick={refresh}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-vibrantorange/50 transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {notice && (
          <div className="mb-4 rounded-xl border border-vibrantorange/30 bg-vibrantorange/10 px-4 py-3 text-sm text-orange-200">
            {notice}
          </div>
        )}

        {/* Active bots */}
        <div className="glass-card p-5 mb-6">
          {loading && bots.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="animate-spin text-vibrantorange" />
            </div>
          ) : bots.length === 0 ? (
            <p className="text-gray-500 text-sm py-6 text-center">
              Toti isn&apos;t in any meeting right now.
            </p>
          ) : (
            <ul className="space-y-3">
              {bots.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {b.title || "Untitled meeting"}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {b.platform} · {b.status}
                      {b.joinedAt ? ` · joined ${new Date(b.joinedAt).toLocaleTimeString()}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(b.id)}
                    disabled={removing === b.id}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-3 py-2 text-white text-xs font-medium transition-colors disabled:opacity-60"
                  >
                    {removing === b.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <LogOut size={14} />
                    )}
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Send Toti into a meeting */}
        <div className="glass-card p-5">
          <h2 className="text-white font-semibold mb-1">Send Toti to a meeting</h2>
          <p className="text-gray-500 text-sm mb-4">
            Paste a Zoom, Meet or Teams link and he&apos;ll join to assist and take notes.
          </p>
          <form onSubmit={send} className="space-y-3">
            <input
              type="url"
              required
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="https://zoom.us/j/…"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-vibrantorange focus:outline-none text-sm"
            />
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Meeting name (optional)"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-vibrantorange focus:outline-none text-sm"
            />
            <button
              type="submit"
              disabled={sending || !meetingUrl.trim()}
              className="w-full btn-primary py-3 inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Send Toti in
            </button>
          </form>
        </div>

        <p className="text-gray-600 text-xs mt-6 text-center">
          Toti no longer joins meetings automatically — he only attends calls booked with him, or
          ones you send him to here.
        </p>
      </div>
    </div>
  );
}

export default function BotsClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-vibrantorange" />
        </div>
      }
    >
      <BotsPanel />
    </Suspense>
  );
}

"use client";

/**
 * Toti Meeting Room — a self-hosted video call where Toti (Anam avatar) joins
 * natively alongside any number of human participants.
 *
 * Access is booking-gated: visitors verify the email they booked with, and the
 * room only unlocks inside their booked window (15 min early → 10 min grace).
 * Stephen bypasses with a host key (?key=... in the URL, e.g. from the summon
 * email) and can step into any ongoing room.
 *
 * Architecture:
 * - Humans connect to each other over a WebRTC mesh (fine for 2–5 people).
 * - Signaling + roster run over a Supabase Realtime channel (broadcast + presence).
 * - The HOST (earliest joiner) owns the Toti session: their browser creates the
 *   Anam avatar, feeds it a WebAudio mix of every participant's audio (so Toti
 *   hears the whole room), renders him locally, and relays his video/audio
 *   tracks to every other participant through the same peer connections.
 */

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient as createSupabaseClient, type RealtimeChannel } from "@supabase/supabase-js";
import {
  Mic,
  MicOff,
  PhoneOff,
  Link2,
  Check,
  Loader2,
  Sparkles,
  Users,
  UserPlus,
  Clock,
  CalendarPlus,
  Mail,
} from "lucide-react";

/* ------------------------------ Configuration ----------------------------- */

// Toti Room Supabase — used only for Realtime signaling (anon key is public by design).
const SIGNALING_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co";
const SIGNALING_ANON_KEY =
  process.env.NEXT_PUBLIC_TOTIROOM_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZGVndHRnd3Rwa2JqdHZqZ25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzIxMjAsImV4cCI6MjA4NDAwODEyMH0.0j4_x-CmkDlIAUC07N9zMs3i7iTN5468_liR7B4Mx2Y";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
];

/* --------------------------------- Types ---------------------------------- */

interface AnamClientLike {
  stream(userProvidedAudioStream?: MediaStream): Promise<MediaStream[]>;
  talk(content: string): Promise<void>;
  stopAllStreams?: () => void;
}

interface RosterEntry {
  peerId: string;
  name: string;
  joinedAt: number;
}

interface SignalMessage {
  from: string;
  to: string;
  kind: "offer" | "answer" | "ice";
  sdp?: string;
  sdpType?: RTCSdpType;
  candidate?: RTCIceCandidateInit;
}

interface RemotePeer {
  peerId: string;
  name: string;
  stream: MediaStream | null;
}

interface Access {
  room: string;
  title: string;
  start?: string;
  end?: string;
  name?: string;
  host?: boolean;
}

interface UpcomingBooking {
  title: string;
  start: string;
  name?: string;
}

type Stage = "verify" | "lobby" | "joining" | "call" | "left";

/* -------------------------------- Component -------------------------------- */

function MeetRoom() {
  const searchParams = useSearchParams();
  const urlKey = searchParams.get("key") || "";
  const urlRoom = searchParams.get("room") || "";

  const [stage, setStage] = useState<Stage>("verify");
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingBooking | null>(null);
  const [access, setAccess] = useState<Access | null>(null);

  const [name, setName] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [totiState, setTotiState] = useState<"idle" | "connecting" | "live" | "error">("idle");
  const [totiError, setTotiError] = useState<string | null>(null);
  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);
  const [lobbyError, setLobbyError] = useState<string | null>(null);
  const [summonState, setSummonState] = useState<"idle" | "sending" | "sent">("idle");

  const peerIdRef = useRef<string>("");
  const localStreamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const pcsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const rosterRef = useRef<Map<string, RosterEntry>>(new Map());
  const joinedAtRef = useRef<number>(0);
  const anamRef = useRef<AnamClientLike | null>(null);
  const totiStreamRef = useRef<MediaStream | null>(null);
  const totiStreamIdsRef = useRef<Set<string>>(new Set());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mixDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const mixedSourcesRef = useRef<Map<string, MediaStreamAudioSourceNode>>(new Map());
  const isHostRef = useRef(false);
  const greetedRef = useRef(false);
  const accessRef = useRef<Access | null>(null);
  const nameRef = useRef("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const lobbyVideoRef = useRef<HTMLVideoElement>(null);
  const totiVideoRef = useRef<HTMLVideoElement>(null);
  const totiAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    accessRef.current = access;
  }, [access]);
  useEffect(() => {
    nameRef.current = name;
  }, [name]);

  /* ------------------------------ Access check ------------------------------ */

  const verifyAccess = useCallback(
    async (opts: { email?: string; hostKey?: string }) => {
      setVerifying(true);
      setVerifyError(null);
      setUpcoming(null);
      try {
        const res = await fetch("/api/meet/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: opts.email,
            hostKey: opts.hostKey,
            room: urlRoom || undefined,
          }),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          room?: string;
          title?: string;
          start?: string;
          end?: string;
          name?: string;
          host?: boolean;
          reason?: string;
          upcoming?: UpcomingBooking;
        };
        if (data.ok && data.room) {
          setAccess({
            room: data.room,
            title: data.title || "Discovery Call with Toti",
            start: data.start,
            end: data.end,
            name: data.name,
            host: data.host,
          });
          if (data.name && !name) setName(data.name);
          setStage("lobby");
        } else if (data.reason === "not_yet" && data.upcoming) {
          setUpcoming(data.upcoming);
        } else if (data.reason === "no_booking") {
          setVerifyError(
            "We couldn't find a booking for that email. Please use the email you booked with, or book a call first."
          );
        } else {
          setVerifyError("Verification failed. Please try again.");
        }
      } catch {
        setVerifyError("Could not reach the server. Please try again.");
      } finally {
        setVerifying(false);
      }
    },
    [urlRoom, name]
  );

  // Host fast-path: ?key=... in URL (e.g. from the summon email).
  useEffect(() => {
    if (urlKey) verifyAccess({ hostKey: urlKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  /* ------------------------------ Lobby preview ----------------------------- */

  useEffect(() => {
    if (stage !== "lobby") return;
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        if (lobbyVideoRef.current) lobbyVideoRef.current.srcObject = stream;
      } catch {
        setLobbyError(
          "Camera and microphone are required for this meeting. Please allow access and reload."
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stage]);

  useEffect(() => {
    const saved = localStorage.getItem("meet-name");
    if (saved) setName((n) => n || saved);
  }, []);

  // Attach the local stream to the in-call self tile once the call view exists.
  useEffect(() => {
    if (stage === "call" && localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.play().catch(() => undefined);
    }
  }, [stage]);

  /* ------------------------------ Call timer -------------------------------- */

  useEffect(() => {
    if (stage !== "call") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [stage]);

  /* ---------------------------- Audio mixing (host) -------------------------- */

  const ensureMixer = useCallback((): MediaStream => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
      mixDestRef.current = audioCtxRef.current.createMediaStreamDestination();
    }
    return mixDestRef.current!.stream;
  }, []);

  const addToMix = useCallback((key: string, stream: MediaStream) => {
    const ctx = audioCtxRef.current;
    const dest = mixDestRef.current;
    if (!ctx || !dest || mixedSourcesRef.current.has(key)) return;
    if (stream.getAudioTracks().length === 0) return;
    const src = ctx.createMediaStreamSource(stream);
    src.connect(dest);
    mixedSourcesRef.current.set(key, src);
  }, []);

  /* ------------------------------ Toti (host) -------------------------------- */

  const startToti = useCallback(async () => {
    if (anamRef.current || totiState === "connecting") return;
    setTotiState("connecting");
    try {
      const roster = Array.from(rosterRef.current.values()).map((r) => r.name);
      const res = await fetch("/api/anam/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participants: roster.length ? roster : [nameRef.current || "Guest"],
          meetingTitle: accessRef.current?.title,
        }),
      });
      const data = (await res.json()) as { sessionToken?: string; error?: string };
      if (!res.ok || !data.sessionToken) {
        throw new Error(data.error || "Could not create Toti session");
      }

      const { createClient } = await import("@anam-ai/js-sdk");
      const anam = createClient(data.sessionToken) as unknown as AnamClientLike;
      anamRef.current = anam;

      // Toti listens to a mix of EVERY participant (host mic + remote peers).
      const mixed = ensureMixer();
      if (localStreamRef.current) addToMix("self", localStreamRef.current);

      const streams = await anam.stream(mixed);
      const totiStream = new MediaStream();
      streams.forEach((s) => s.getTracks().forEach((t) => totiStream.addTrack(t)));
      totiStreamRef.current = totiStream;
      totiStreamIdsRef.current.add(totiStream.id);
      streams.forEach((s) => totiStreamIdsRef.current.add(s.id));

      if (totiVideoRef.current) {
        totiVideoRef.current.srcObject = new MediaStream(totiStream.getVideoTracks());
        totiVideoRef.current.play().catch(() => undefined);
      }
      if (totiAudioRef.current) {
        totiAudioRef.current.srcObject = new MediaStream(totiStream.getAudioTracks());
        totiAudioRef.current.play().catch(() => undefined);
      }

      // Relay Toti's tracks to every connected peer.
      broadcastTotiStreamIds();
      pcsRef.current.forEach((pc) => addTotiTracks(pc));

      setTotiState("live");
      if (!greetedRef.current) {
        greetedRef.current = true;
        const firstName = (nameRef.current || "").trim().split(" ")[0];
        const greeting = accessRef.current?.host
          ? "Hello Stephen — I'm here and ready whenever you are."
          : `Hello${firstName ? ` ${firstName}` : ""}! I'm Toti, Stephen's AI assistant. Welcome to your call — I can see and hear you, so whenever you're ready, tell me a little about yourself and your business.`;
        setTimeout(() => {
          anam.talk(greeting).catch(() => undefined);
        }, 2500);
      }
    } catch (err) {
      console.error("Toti init failed:", err);
      setTotiError(err instanceof Error ? err.message : "Toti failed to start");
      setTotiState("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totiState, ensureMixer, addToMix]);

  const addTotiTracks = (pc: RTCPeerConnection) => {
    const stream = totiStreamRef.current;
    if (!stream) return;
    const existing = new Set(pc.getSenders().map((s) => s.track?.id));
    stream.getTracks().forEach((track) => {
      if (!existing.has(track.id)) pc.addTrack(track, stream);
    });
  };

  const broadcastTotiStreamIds = () => {
    const ids = Array.from(totiStreamIdsRef.current);
    if (ids.length && channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "toti-info",
        payload: { streamIds: ids },
      });
    }
  };

  /* ------------------------------ Peer helpers -------------------------------- */

  const sendSignal = (msg: SignalMessage) => {
    channelRef.current?.send({ type: "broadcast", event: "signal", payload: msg });
  };

  const createPeerConnection = useCallback(
    (theirId: string, theirName: string) => {
      if (pcsRef.current.has(theirId)) return pcsRef.current.get(theirId)!;

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcsRef.current.set(theirId, pc);
      const myId = peerIdRef.current;
      const polite = myId < theirId; // perfect-negotiation politeness
      let makingOffer = false;

      localStreamRef.current?.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
      if (isHostRef.current) addTotiTracks(pc);

      pc.onnegotiationneeded = async () => {
        try {
          makingOffer = true;
          await pc.setLocalDescription();
          if (pc.localDescription) {
            sendSignal({
              from: myId,
              to: theirId,
              kind: "offer",
              sdp: pc.localDescription.sdp,
              sdpType: pc.localDescription.type,
            });
          }
        } catch (e) {
          console.error("negotiation error", e);
        } finally {
          makingOffer = false;
        }
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          sendSignal({ from: myId, to: theirId, kind: "ice", candidate: e.candidate.toJSON() });
        }
      };

      pc.ontrack = (e) => {
        const stream = e.streams[0];
        if (!stream) return;
        if (totiStreamIdsRef.current.has(stream.id)) {
          // Relayed Toti feed (we are not the host).
          totiStreamRef.current = stream;
          if (totiVideoRef.current && stream.getVideoTracks().length) {
            totiVideoRef.current.srcObject = stream;
            totiVideoRef.current.play().catch(() => undefined);
          }
          if (totiAudioRef.current && stream.getAudioTracks().length) {
            totiAudioRef.current.srcObject = stream;
            totiAudioRef.current.play().catch(() => undefined);
          }
          setTotiState("live");
          return;
        }
        // Human participant feed.
        setRemotePeers((current) => {
          const others = current.filter((p) => p.peerId !== theirId);
          return [...others, { peerId: theirId, name: theirName, stream }];
        });
        if (isHostRef.current) addToMix(theirId, stream);
      };

      // Store negotiation metadata on the connection for the signal handler.
      (pc as unknown as Record<string, unknown>).__meta = {
        get makingOffer() {
          return makingOffer;
        },
        polite,
      };

      return pc;
    },
    [addToMix]
  );

  const handleSignal = useCallback(
    async (msg: SignalMessage) => {
      const myId = peerIdRef.current;
      if (msg.to !== myId) return;
      const entry = rosterRef.current.get(msg.from);
      const pc = createPeerConnection(msg.from, entry?.name || "Guest");
      const meta = (pc as unknown as Record<string, unknown>).__meta as {
        makingOffer: boolean;
        polite: boolean;
      };

      try {
        if (msg.kind === "offer" && msg.sdp) {
          const collision = meta.makingOffer || pc.signalingState !== "stable";
          if (collision && !meta.polite) return; // impolite peer ignores colliding offer
          await pc.setRemoteDescription({ type: "offer", sdp: msg.sdp });
          await pc.setLocalDescription();
          if (pc.localDescription) {
            sendSignal({
              from: myId,
              to: msg.from,
              kind: "answer",
              sdp: pc.localDescription.sdp,
              sdpType: pc.localDescription.type,
            });
          }
        } else if (msg.kind === "answer" && msg.sdp) {
          await pc.setRemoteDescription({ type: "answer", sdp: msg.sdp });
        } else if (msg.kind === "ice" && msg.candidate) {
          await pc.addIceCandidate(msg.candidate).catch(() => undefined);
        }
      } catch (e) {
        console.error("signal handling error", e);
      }
    },
    [createPeerConnection]
  );

  /* ------------------------------ Join / leave -------------------------------- */

  const joinCall = useCallback(async () => {
    const grantedAccess = accessRef.current;
    if (!grantedAccess) return;
    if (!localStreamRef.current || localStreamRef.current.getVideoTracks().length === 0) {
      setLobbyError("Camera is required for this meeting — allow access and try again.");
      return;
    }
    const displayName = name.trim() || grantedAccess.name || "Guest";
    localStorage.setItem("meet-name", displayName);
    setStage("joining");

    const myId = crypto.randomUUID();
    peerIdRef.current = myId;
    joinedAtRef.current = Date.now();

    const supabase = createSupabaseClient(SIGNALING_URL, SIGNALING_ANON_KEY, {
      realtime: { params: { eventsPerSecond: 20 } },
    });
    const channel = supabase.channel(`meet:${grantedAccess.room}`, {
      config: { presence: { key: myId }, broadcast: { self: false } },
    });
    channelRef.current = channel;

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<RosterEntry>();
      rosterRef.current.clear();
      Object.values(state).forEach((entries) => {
        entries.forEach((e) => rosterRef.current.set(e.peerId, e));
      });

      // Host = earliest joiner still present (deterministic tie-break on peerId).
      const members = Array.from(rosterRef.current.values()).sort(
        (a, b) => a.joinedAt - b.joinedAt || a.peerId.localeCompare(b.peerId)
      );
      const hostId = members[0]?.peerId;
      const amHost = hostId === myId;
      isHostRef.current = amHost;
      setIsHost(amHost);
      if (amHost) startToti();

      // Open a connection to every other member.
      members.forEach((m) => {
        if (m.peerId !== myId) createPeerConnection(m.peerId, m.name);
      });

      // Drop connections for peers who left.
      pcsRef.current.forEach((pc, id) => {
        if (!rosterRef.current.has(id)) {
          pc.close();
          pcsRef.current.delete(id);
          setRemotePeers((current) => current.filter((p) => p.peerId !== id));
        }
      });
      if (isHostRef.current) broadcastTotiStreamIds();
    });

    channel.on("broadcast", { event: "signal" }, ({ payload }) => {
      handleSignal(payload as SignalMessage);
    });

    channel.on("broadcast", { event: "toti-info" }, ({ payload }) => {
      const p = payload as { streamIds?: string[] };
      (p.streamIds || []).forEach((id) => totiStreamIdsRef.current.add(id));
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ peerId: myId, name: displayName, joinedAt: joinedAtRef.current });
        setStage("call");
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setLobbyError("Could not connect to the meeting service. Please try again.");
        setStage("lobby");
      }
    });
  }, [name, createPeerConnection, handleSignal, startToti]);

  const leaveCall = useCallback(() => {
    pcsRef.current.forEach((pc) => pc.close());
    pcsRef.current.clear();
    channelRef.current?.unsubscribe();
    channelRef.current = null;
    anamRef.current?.stopAllStreams?.();
    anamRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    audioCtxRef.current?.close().catch(() => undefined);
    audioCtxRef.current = null;
    setStage("left");
  }, []);

  useEffect(() => () => leaveCall(), [leaveCall]);

  /* -------------------------------- Controls --------------------------------- */

  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    setMicOn((v) => !v);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText("https://stevetoti.com/meet");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const summonStephen = async () => {
    if (summonState !== "idle") return;
    setSummonState("sending");
    try {
      await fetch("/api/meet/summon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: accessRef.current?.room,
          requestedBy: name.trim() || "A participant",
          participants: [name.trim() || "Guest", ...remotePeers.map((p) => p.name)],
        }),
      });
      setSummonState("sent");
      setTimeout(() => setSummonState("idle"), 60_000);
    } catch {
      setSummonState("idle");
    }
  };

  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* ---------------------------------- Views ----------------------------------- */

  if (stage === "verify") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-3xl font-bold">
              <span className="text-white">Steve</span>
              <span className="gradient-text">Toti</span>
            </span>
            <p className="text-gray-400 mt-2">Meeting room</p>
          </div>

          <div className="glass-card p-6 md:p-8">
            {upcoming ? (
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full bg-vibrantorange/10 border border-vibrantorange/30 mb-4">
                  <Clock size={24} className="text-vibrantorange" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2">
                  {upcoming.name ? `See you soon, ${upcoming.name.split(" ")[0]}!` : "See you soon!"}
                </h1>
                <p className="text-gray-400 mb-1">{upcoming.title}</p>
                <p className="text-white font-medium mb-6">
                  {new Date(upcoming.start).toLocaleString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  The room unlocks 15 minutes before your call. Come back then!
                </p>
                <button
                  onClick={() => setUpcoming(null)}
                  className="text-vibrantorange text-sm hover:underline"
                >
                  Check a different email
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white mb-2">Join your meeting</h1>
                <p className="text-gray-400 text-sm mb-6">
                  Enter the email you booked with and we&apos;ll take you to your room.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    verifyAccess({ email });
                  }}
                >
                  <label htmlFor="verify-email" className="block text-sm text-gray-400 mb-1.5">
                    Booking email
                  </label>
                  <div className="relative mb-4">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      id="verify-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-vibrantorange focus:outline-none focus:ring-1 focus:ring-vibrantorange transition-colors"
                    />
                  </div>
                  {verifyError && <p className="text-red-400 text-sm mb-4">{verifyError}</p>}
                  <button
                    type="submit"
                    disabled={verifying}
                    className="w-full btn-primary py-3.5 inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {verifying ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Checking…
                      </>
                    ) : (
                      "Find my meeting"
                    )}
                  </button>
                </form>
                <p className="text-gray-500 text-xs mt-5 text-center">
                  No booking yet?{" "}
                  <Link href="/" className="text-vibrantorange hover:underline">
                    Chat with Toti on stevetoti.com
                  </Link>{" "}
                  to book your free discovery call.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === "left") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex p-4 rounded-full bg-vibrantorange/10 border border-vibrantorange/30 mb-6">
            <Sparkles size={32} className="text-vibrantorange" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Thanks for meeting with Toti</h1>
          <p className="text-gray-400 mb-8">
            We&apos;ll follow up shortly. If you&apos;d like to continue the conversation,
            Stephen is one message away.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => window.location.reload()} className="btn-secondary py-3 px-6">
              Rejoin meeting
            </button>
            <Link href="/" className="btn-primary py-3 px-6">
              Visit stevetoti.com
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "lobby" || stage === "joining") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-3xl font-bold">
              <span className="text-white">Steve</span>
              <span className="gradient-text">Toti</span>
            </span>
            <p className="text-gray-400 mt-2">{access?.title || "Meeting room"}</p>
            {access?.start && (
              <p className="text-gray-500 text-sm mt-1 inline-flex items-center gap-1.5">
                <CalendarPlus size={13} />
                {new Date(access.start).toLocaleString(undefined, {
                  weekday: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          <div className="glass-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Camera preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border border-white/10">
              <video ref={lobbyVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {lobbyError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950/90 p-4">
                  <p className="text-red-400 text-sm text-center">{lobbyError}</p>
                </div>
              )}
            </div>

            {/* Join panel */}
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {access?.name ? `Welcome, ${access.name.split(" ")[0]}!` : "Ready to join?"}
              </h1>
              <p className="text-gray-400 text-sm mb-6">
                <span className="text-vibrantorange font-medium">Toti</span>, Stephen&apos;s AI
                assistant, will greet you in the room with video and voice. Camera stays on for
                the meeting.
              </p>
              <label htmlFor="meet-name" className="block text-sm text-gray-400 mb-1.5">
                Your name
              </label>
              <input
                id="meet-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-vibrantorange focus:outline-none focus:ring-1 focus:ring-vibrantorange transition-colors mb-6"
              />
              <button
                onClick={joinCall}
                disabled={stage === "joining" || !!lobbyError}
                className="w-full btn-primary py-3.5 inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {stage === "joining" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Joining…
                  </>
                ) : (
                  "Join meeting"
                )}
              </button>
              <p className="text-gray-500 text-xs mt-4">
                By joining you agree the call may be summarised for follow-up.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------------- In call ---------------------------------- */

  const totalTiles = 2 + remotePeers.length; // Toti + self + remotes
  const gridClass =
    totalTiles <= 2
      ? "grid-cols-1 md:grid-cols-2"
      : totalTiles <= 4
        ? "grid-cols-2"
        : "grid-cols-2 md:grid-cols-3";

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10">
        <span className="text-lg font-bold">
          <span className="text-white">Steve</span>
          <span className="gradient-text">Toti</span>
          <span className="text-gray-500 font-normal text-sm ml-3 hidden sm:inline">
            {access?.title || "Meeting room"}
          </span>
        </span>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Users size={15} /> {1 + remotePeers.length}
          </span>
          <span className="tabular-nums">{fmtTime(elapsed)}</span>
        </div>
      </div>

      {/* Hidden audio sink for Toti */}
      <audio ref={totiAudioRef} autoPlay className="hidden" />

      {/* Video grid */}
      <div className={`flex-1 grid ${gridClass} gap-3 p-3 md:p-5 content-center`}>
        {/* Toti tile */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-vibrantorange/40 aspect-video shadow-lg shadow-vibrantorange/10">
          <video ref={totiVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          {totiState !== "live" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 gap-3 p-4">
              {totiState === "error" ? (
                <p className="text-red-400 text-sm text-center">Toti couldn&apos;t start: {totiError}</p>
              ) : (
                <>
                  <Loader2 size={28} className="animate-spin text-vibrantorange" />
                  <p className="text-gray-400 text-sm">Toti is joining…</p>
                </>
              )}
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-gray-950/70 backdrop-blur px-2.5 py-1 rounded-lg">
            <Sparkles size={13} className="text-vibrantorange" />
            <span className="text-white text-sm font-medium">Toti</span>
            <span className="text-[10px] uppercase tracking-wide text-vibrantorange/90 font-semibold ml-1">AI</span>
          </div>
        </div>

        {/* Self tile */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-white/10 aspect-video">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-gray-950/70 backdrop-blur px-2.5 py-1 rounded-lg">
            <span className="text-white text-sm font-medium">
              {name.trim() || "You"} {isHost && <span className="text-gray-400 text-xs">(host)</span>}
            </span>
          </div>
          {!micOn && (
            <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/90">
              <MicOff size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* Remote participants */}
        {remotePeers.map((peer) => (
          <RemoteTile key={peer.peerId} peer={peer} />
        ))}
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-center gap-3 px-4 py-4 border-t border-white/10">
        <button
          onClick={toggleMic}
          className={`p-3.5 rounded-full transition-colors ${
            micOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500 text-white"
          }`}
          aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
        >
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button
          onClick={copyLink}
          className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Copy meeting link"
        >
          {copied ? <Check size={20} className="text-emerald-400" /> : <Link2 size={20} />}
        </button>
        {!access?.host && (
          <button
            onClick={summonStephen}
            disabled={summonState !== "idle"}
            className="px-4 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors disabled:opacity-70"
            aria-label="Ask Stephen to join this meeting"
          >
            {summonState === "sent" ? (
              <>
                <Check size={16} className="text-emerald-400" />
                <span className="hidden sm:inline">Stephen notified</span>
              </>
            ) : summonState === "sending" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <UserPlus size={16} />
                <span className="hidden sm:inline">Call Stephen in</span>
              </>
            )}
          </button>
        )}
        <button
          onClick={leaveCall}
          className="px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium inline-flex items-center gap-2 transition-colors"
        >
          <PhoneOff size={18} /> Leave
        </button>
      </div>
    </div>
  );
}

function RemoteTile({ peer }: { peer: RemotePeer }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && peer.stream) {
      ref.current.srcObject = peer.stream;
      ref.current.play().catch(() => undefined);
    }
  }, [peer.stream]);
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-white/10 aspect-video">
      <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-2 left-2 bg-gray-950/70 backdrop-blur px-2.5 py-1 rounded-lg">
        <span className="text-white text-sm font-medium">{peer.name}</span>
      </div>
    </div>
  );
}

export default function MeetClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-vibrantorange" />
        </div>
      }
    >
      <MeetRoom />
    </Suspense>
  );
}

"use client";
import { useState, type FormEvent } from "react";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";
import { HoneypotField, useFormBotFields } from "@/components/security/FormBotFields";

export default function VideoGuideSignup({ slug }: { slug: string }) {
  const bot = useFormBotFields();
  const [token, setToken] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [download, setDownload] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) { setError("Please complete the human verification below."); return; }
    const form = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/newsletter", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name:form.get("name"), email:form.get("email"), newsletter_consent:form.get("consent") === "on", guide_slug:slug, website:bot.honeypot, form_started_at:bot.formStartedAt, turnstile_token:token})});
      const data = await response.json();
      if (!response.ok || typeof data.download_url !== "string") throw new Error(data.error || "Could not unlock the guide. Please try again.");
      setDownload(data.download_url);
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { setBusy(false); setToken(null); setAttempt(n => n + 1); }
  }
  return <section className="mt-8 rounded-2xl bg-vibrantorange/10 border border-vibrantorange/30 p-6" aria-labelledby="guide-heading">
    <h2 id="guide-heading" className="text-xl font-bold">Get the free lesson guide</h2>
    <p className="text-gray-300 mt-2">Join Steve’s newsletter for practical AI tutorials and updates, and get this step-by-step PDF, worksheet and review checklist.</p>
    {download ? <div className="mt-5" role="status"><p className="mb-4">You’re on the list. Your guide is ready.</p><a className="btn-primary inline-block" href={download}>Download PDF</a><p className="text-sm text-gray-400 mt-3">This link works for one hour. You can use it again if your download is interrupted.</p></div> : <form onSubmit={submit} className="mt-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">Name<input required name="name" autoComplete="name" maxLength={100} className="mt-2 w-full rounded-lg border border-white/20 bg-gray-950 p-3 text-white" /></label>
        <label className="block">Email<input required name="email" type="email" autoComplete="email" maxLength={254} className="mt-2 w-full rounded-lg border border-white/20 bg-gray-950 p-3 text-white" /></label>
      </div>
      <label className="flex items-start gap-3 text-sm text-gray-300"><input required type="checkbox" name="consent" className="mt-1 h-4 w-4 shrink-0" /><span>Yes, sign me up for Steve Toti’s newsletter and give me the free guide. I can unsubscribe from newsletter emails at any time. My name and email will be stored for this newsletter.</span></label>
      <HoneypotField value={bot.honeypot} onChange={bot.setHoneypot} />
      <TurnstileWidget key={attempt} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""} onVerify={setToken} theme="dark" />
      {error && <p role="alert" className="text-red-300">{error}</p>}
      <button disabled={busy} className="btn-primary disabled:opacity-60" type="submit">{busy ? "Preparing your guide…" : "Join newsletter & unlock PDF"}</button>
    </form>}
  </section>;
}

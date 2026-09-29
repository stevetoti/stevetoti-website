"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Edit, ExternalLink, Eye, EyeOff, ImagePlus, Loader2, MousePointerClick, Plus, Save, Star, Trash2, Wrench, X } from "lucide-react";
import type { AffiliateTool, AffiliateToolInput } from "@/lib/affiliate-tools";

type AdminTool = AffiliateTool & { clicks: { total: number; last30: number } };
type Draft = AffiliateToolInput & { id?: string };

const emptyDraft: Draft = {
  slug: "",
  name: "",
  category: "",
  tagline: "",
  description: "",
  website_url: "",
  affiliate_url: "",
  image_url: "",
  cta_label: "Get started",
  badge: "",
  is_own_product: false,
  is_featured: false,
  is_published: true,
  sort_order: 100,
};

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function toDraft(tool: AdminTool): Draft {
  return {
    id: tool.id,
    slug: tool.slug,
    name: tool.name,
    category: tool.category,
    tagline: tool.tagline ?? "",
    description: tool.description,
    website_url: tool.website_url ?? "",
    affiliate_url: tool.affiliate_url,
    image_url: tool.image_url ?? "",
    cta_label: tool.cta_label,
    badge: tool.badge ?? "",
    is_own_product: tool.is_own_product,
    is_featured: tool.is_featured,
    is_published: tool.is_published,
    sort_order: tool.sort_order,
  };
}

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${localStorage.getItem("admin_auth") ?? ""}` };
}

const inputClass =
  "w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-vibrantorange";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-300 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
    </label>
  );
}

export default function ToolsAdminPage() {
  const [tools, setTools] = useState<AdminTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/tools", { headers: authHeaders() });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Failed to load tools");
      setTools(body.data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tools");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  const openNew = () => {
    const nextOrder = tools.length ? Math.max(...tools.map((tool) => tool.sort_order)) + 10 : 10;
    setDraft({ ...emptyDraft, sort_order: nextOrder });
    setSlugTouched(false);
    setError("");
  };

  const openEdit = (tool: AdminTool) => {
    setDraft(toDraft(tool));
    setSlugTouched(true);
    setError("");
  };

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => {
      if (!current) return current;
      const next = { ...current, [key]: value };
      if (key === "name" && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
  };

  const save = async (tool: Draft) => {
    const response = await fetch("/api/admin/tools", {
      method: tool.id ? "PUT" : "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(tool),
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Could not save the tool");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError("");
    try {
      await save(draft);
      await load();
      setNotice(draft.id ? "Tool updated" : "Tool added");
      setDraft(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the tool");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (tool: AdminTool, key: "is_published" | "is_featured") => {
    try {
      await save({ ...toDraft(tool), [key]: !tool[key] });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the tool");
    }
  };

  const remove = async (tool: AdminTool) => {
    if (!confirm(`Delete ${tool.name}? Its /go/${tool.slug} link will stop working.`)) return;
    const response = await fetch(`/api/admin/tools?id=${tool.id}`, { method: "DELETE", headers: authHeaders() });
    if (response.ok) {
      await load();
      setNotice("Tool deleted");
    } else {
      const body = await response.json().catch(() => ({}));
      setError(body.error || "Could not delete the tool");
    }
  };

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/tools/upload", { method: "POST", headers: authHeaders(), body: form });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Upload failed");
      update("image_url", body.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const copyLink = async (slug: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/go/${slug}`);
    setNotice("Short link copied");
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Wrench className="text-vibrantorange" /> Tools & Affiliates
          </h1>
          <p className="text-gray-400 mt-1">
            Everything here appears on{" "}
            <a href="/tools" target="_blank" className="text-vibrantorange hover:underline">
              stevetoti.com/tools
            </a>{" "}
            within a minute of saving.
          </p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-3 bg-vibrantorange hover:bg-orange-600 text-white font-semibold rounded-xl">
          <Plus size={20} /> Add tool
        </button>
      </div>

      {notice && <div className="mb-4 rounded-xl bg-brandgreen/15 border border-brandgreen/30 px-4 py-3 text-brandgreen">{notice}</div>}
      {error && !draft && <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-vibrantorange" />
        </div>
      ) : tools.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-400">No tools yet. Add your first one.</div>
      ) : (
        <div className="space-y-4">
          {tools.map((tool) => (
            <div key={tool.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-44 aspect-[16/10] shrink-0 rounded-xl overflow-hidden bg-gray-800">
                {tool.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tool.image_url} alt="" className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">No image</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">{tool.name}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">{tool.category}</span>
                  {tool.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-vibrantorange/20 text-vibrantorange">{tool.badge}</span>}
                  {!tool.is_published && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">Hidden</span>}
                </div>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{tool.tagline || tool.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                  <button onClick={() => copyLink(tool.slug)} className="flex items-center gap-1.5 text-gray-300 hover:text-white" title="Copy short link">
                    <Copy size={14} /> /go/{tool.slug}
                  </button>
                  <span className="flex items-center gap-1.5 text-gray-400" title="Clicks in the last 30 days (all time)">
                    <MousePointerClick size={14} /> {tool.clicks.last30} clicks in 30 days ({tool.clicks.total} total)
                  </span>
                  <span className="text-gray-500">Order {tool.sort_order}</span>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 shrink-0">
                <button onClick={() => openEdit(tool)} className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white" title="Edit">
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => toggle(tool, "is_published")}
                  className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white"
                  title={tool.is_published ? "Hide from page" : "Show on page"}
                >
                  {tool.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => toggle(tool, "is_featured")}
                  className={`p-2 rounded-lg bg-gray-800 hover:text-white ${tool.is_featured ? "text-vibrantorange" : "text-gray-500"}`}
                  title={tool.is_featured ? "Remove highlight" : "Highlight"}
                >
                  <Star size={18} fill={tool.is_featured ? "currentColor" : "none"} />
                </button>
                <a href={`/go/${tool.slug}`} target="_blank" rel="noopener" className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white" title="Test link">
                  <ExternalLink size={18} />
                </a>
                <button onClick={() => remove(tool)} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {draft && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center overflow-y-auto p-4">
          <form onSubmit={submit} className="w-full max-w-2xl my-8 bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{draft.id ? `Edit ${draft.name}` : "Add a tool"}</h2>
              <button type="button" onClick={() => setDraft(null)} className="text-gray-400 hover:text-white" aria-label="Close">
                <X />
              </button>
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-300 mb-1.5">Image</span>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48 aspect-[16/10] rounded-xl overflow-hidden bg-gray-800 shrink-0 flex items-center justify-center">
                  {draft.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={draft.image_url} alt="" className="w-full h-full object-cover object-top" />
                  ) : (
                    <ImagePlus className="text-gray-600" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])}
                  />
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white hover:border-vibrantorange disabled:opacity-60"
                  >
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />} Upload image
                  </button>
                  <input
                    className={inputClass}
                    placeholder="…or paste an image link"
                    value={draft.image_url ?? ""}
                    onChange={(event) => update("image_url", event.target.value)}
                  />
                  <p className="text-xs text-gray-500">A screenshot of the website or the program&apos;s banner works best (landscape, about 1200×750, under 4 MB).</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name *">
                <input className={inputClass} required value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="Wise" />
              </Field>
              <Field label="Category *" hint="Tools are grouped by this, e.g. Web Hosting, Payments, AI Tools">
                <input
                  className={inputClass}
                  required
                  list="tool-categories"
                  value={draft.category}
                  onChange={(event) => update("category", event.target.value)}
                  placeholder="Payments"
                />
                <datalist id="tool-categories">
                  {Array.from(new Set(tools.map((tool) => tool.category))).map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </Field>
            </div>

            <Field label="Affiliate link *" hint="Where visitors go when they click the image or button">
              <input
                className={inputClass}
                required
                type="url"
                value={draft.affiliate_url}
                onChange={(event) => update("affiliate_url", event.target.value)}
                placeholder="https://wise.com/invite/…"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Website" hint="Shown on the card as the site name">
                <input className={inputClass} type="url" value={draft.website_url ?? ""} onChange={(event) => update("website_url", event.target.value)} placeholder="https://wise.com" />
              </Field>
              <Field label="Short link" hint={`stevetoti.com/go/${draft.slug || "…"}`}>
                <input
                  className={inputClass}
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  value={draft.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    update("slug", slugify(event.target.value));
                  }}
                />
              </Field>
            </div>

            <Field label="Tagline" hint="One short line under the name">
              <input className={inputClass} value={draft.tagline ?? ""} onChange={(event) => update("tagline", event.target.value)} placeholder="Send and receive money internationally" maxLength={120} />
            </Field>

            <Field label="Description" hint="Why you recommend it, in your own words">
              <textarea
                className={`${inputClass} min-h-28`}
                value={draft.description}
                onChange={(event) => update("description", event.target.value)}
                maxLength={600}
              />
            </Field>

            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Button text">
                <input className={inputClass} value={draft.cta_label} onChange={(event) => update("cta_label", event.target.value)} maxLength={40} />
              </Field>
              <Field label="Badge" hint="Optional, e.g. Top pick">
                <input className={inputClass} value={draft.badge ?? ""} onChange={(event) => update("badge", event.target.value)} maxLength={30} />
              </Field>
              <Field label="Order" hint="Lower shows first">
                <input className={inputClass} type="number" value={draft.sort_order} onChange={(event) => update("sort_order", Number(event.target.value))} />
              </Field>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-300">
              {(
                [
                  ["is_published", "Show on page"],
                  ["is_featured", "Highlight"],
                  ["is_own_product", "Built by me"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={draft[key]} onChange={(event) => update(key, event.target.checked)} className="w-4 h-4 accent-vibrantorange" />
                  {label}
                </label>
              ))}
            </div>

            {error && <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400">{error}</div>}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setDraft(null)} className="px-5 py-2.5 rounded-xl text-gray-300 hover:bg-gray-800">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex items-center gap-2 px-5 py-2.5 bg-vibrantorange hover:bg-orange-600 text-white font-semibold rounded-xl disabled:opacity-60"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save tool
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

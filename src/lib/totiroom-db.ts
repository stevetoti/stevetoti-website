// Server-side access to the Toti Room Supabase project, which backs this site.
// Production env values carry a trailing newline, so everything is trimmed.

export function supabaseUrl(): string {
  return (process.env.TOTIROOM_SUPABASE_URL || "https://rndegttgwtpkbjtvjgnc.supabase.co").trim().replace(/\/+$/, "");
}

export function anonKey(): string | undefined {
  return (process.env.SUPABASE_TOTIROOM_ANON_KEY || process.env.TOTIROOM_SUPABASE_ANON_KEY)?.trim() || undefined;
}

export function serviceKey(): string | undefined {
  return (process.env.SUPABASE_TOTIROOM_SERVICE_KEY || process.env.TOTIROOM_SUPABASE_SERVICE_KEY)?.trim() || undefined;
}

export function restHeaders(key: string): Record<string, string> {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

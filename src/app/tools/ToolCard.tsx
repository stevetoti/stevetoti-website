import Image from "next/image";
import { ArrowUpRight, Globe } from "lucide-react";
import { type AffiliateTool, displayDomain } from "@/lib/affiliate-tools";

// Supabase Storage images can go through the Next image optimiser; any other
// external image URL is served as-is so admins can paste links from anywhere.
function isOptimisable(src: string) {
  return src.startsWith("/") || src.startsWith("https://rndegttgwtpkbjtvjgnc.supabase.co/storage/v1/object/public/");
}

export default function ToolCard({ tool }: { tool: AffiliateTool }) {
  const href = `/go/${tool.slug}`;
  const domain = displayDomain(tool.website_url);
  const linkProps = { href, target: "_blank", rel: "sponsored nofollow noopener" } as const;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white/[0.04] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-vibrantorange/10 ${
        tool.is_featured ? "border-vibrantorange/40" : "border-white/10 hover:border-white/20"
      }`}
    >
      <a {...linkProps} aria-label={`Visit ${tool.name}`} className="relative block aspect-[16/10] overflow-hidden bg-deepblue-900">
        {tool.image_url ? (
          <Image
            src={tool.image_url}
            alt={`${tool.name} website`}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            unoptimized={!isOptimisable(tool.image_url)}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-deepblue-500 to-deepblue-900">
            <span className="text-4xl font-bold text-white/90">{tool.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent opacity-80" />
        {tool.badge && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-lg ${
              tool.is_own_product ? "bg-brandgreen text-white" : "bg-vibrantorange text-gray-950"
            }`}
          >
            {tool.badge}
          </span>
        )}
        <span className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Visit site <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </a>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-vibrantorange">{tool.category}</p>
        <h3 className="text-2xl font-bold text-white">
          <a {...linkProps} className="hover:text-vibrantorange transition-colors">
            {tool.name}
          </a>
        </h3>
        {tool.tagline && <p className="mt-1 font-medium text-gray-300">{tool.tagline}</p>}
        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">{tool.description}</p>

        {domain && (
          <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <Globe className="h-4 w-4" /> {domain}
          </p>
        )}

        <a
          {...linkProps}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-vibrantorange to-orange-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-vibrantorange/30"
        >
          {tool.cta_label} <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

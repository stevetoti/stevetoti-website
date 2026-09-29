"use client";

import { useMemo, useState } from "react";
import type { AffiliateTool } from "@/lib/affiliate-tools";
import ToolCard from "./ToolCard";

export default function ToolsGrid({ tools }: { tools: AffiliateTool[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(tools.map((tool) => tool.category)))], [tools]);
  const [active, setActive] = useState("All");
  const visible = active === "All" ? tools : tools.filter((tool) => tool.category === active);

  if (tools.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-12 text-center text-gray-400">
        New recommendations are on the way. Check back soon.
      </div>
    );
  }

  return (
    <>
      {categories.length > 2 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter tools by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active === category}
              onClick={() => setActive(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                active === category
                  ? "bg-vibrantorange text-gray-950"
                  : "border border-white/10 bg-white/5 text-gray-300 hover:border-white/30 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </>
  );
}

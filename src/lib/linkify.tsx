import React from "react";

/**
 * Renders chat message text with clickable links.
 * Supports markdown links [label](https://url) and bare https:// URLs.
 * Everything else is left as plain text (whitespace preserved by the caller).
 */
const TOKEN_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>")\]]+)/g;

export function linkify(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const label = match[1] || match[3] || "";
    const url = match[2] || match[3] || "";
    // Strip common trailing punctuation from bare URLs ("…call: https://x.com.")
    const trimmed = url.replace(/[.,;:!?]+$/, "");
    const trailing = url.slice(trimmed.length);
    nodes.push(
      <a
        key={`lnk-${key++}`}
        href={trimmed}
        target="_blank"
        rel="noopener noreferrer"
        className="text-vibrantorange underline underline-offset-2 hover:text-orange-300 break-all"
      >
        {match[1] ? label : trimmed}
      </a>
    );
    if (trailing) nodes.push(trailing);
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

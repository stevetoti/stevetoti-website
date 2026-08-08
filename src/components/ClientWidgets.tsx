"use client";

import dynamic from "next/dynamic";

// Toti (video avatar + chat) is heavy (Anam SDK, framer-motion flows) and
// purely interactive — load it client-side after hydration so it never
// blocks first paint or adds to the shared server bundle.
const AnamVideoAvatar = dynamic(() => import("./AnamVideoAvatar"), {
  ssr: false,
});

export default function ClientWidgets() {
  return <AnamVideoAvatar />;
}

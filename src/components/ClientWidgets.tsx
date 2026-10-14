"use client";

import dynamic from "next/dynamic";

// Toti (video avatar + chat) is heavy (Anam SDK, framer-motion flows) and
// purely interactive — load it client-side after hydration so it never
// blocks first paint or adds to the shared server bundle.
function ContactFallback() {
  return <a href="/contact" className="fixed bottom-6 right-6 z-50 rounded-full bg-vibrantorange px-5 py-3 font-semibold text-white shadow-lg">Contact Steve</a>;
}

const AnamVideoAvatar = dynamic(() => import("./AnamVideoAvatar").catch(() => ({ default: ContactFallback })), {
  ssr: false,
});

export default function ClientWidgets() {
  return <AnamVideoAvatar />;
}

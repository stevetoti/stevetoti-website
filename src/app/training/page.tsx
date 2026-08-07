import type { Metadata } from "next";
import TrainingClient from "./TrainingClient";

export const metadata: Metadata = {
  title: "1-on-1 Digital Business & AI Mastery Training | Steve Toti",
  description:
    "Personal 1-on-1 training with Stephen Totimeh, AI Personality of the Year 2026. Build a profitable digital business, then master AI automation. 6-month program with pricing for Ghana, Vanuatu and international students.",
  openGraph: {
    title: "1-on-1 Digital Business & AI Mastery Training",
    description:
      "Train personally with award-winning tech entrepreneur Stephen Totimeh — build a profitable business, then master AI. In person or online.",
    images: ["/images/ghana-ai-summit/award-trophy.jpg"],
  },
};

export default function TrainingPage() {
  return <TrainingClient />;
}

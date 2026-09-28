import type { Metadata } from "next";
import TrainingClient from "./TrainingClient";

export const metadata: Metadata = {
  title: "1-on-1 Digital Business & AI Mastery Training | Steve Toti",
  description:
    "Personal 1-on-1 training with Stephen Totimeh, AI Personality of the Year 2026. Study digital business and affiliate marketing in 6 weeks, or the full AI mastery programme in 3 months. Includes 3 months of personalised mentorship.",
  openGraph: {
    title: "1-on-1 Digital Business & AI Mastery Training",
    description:
      "Learn digital business, affiliate marketing and AI with Stephen Totimeh. Choose 6 weeks or 3 months of training, followed by 3 months of personalised mentorship.",
    images: ["/images/ghana-ai-summit/award-trophy.jpg"],
  },
};

export default function TrainingPage() {
  return <TrainingClient />;
}

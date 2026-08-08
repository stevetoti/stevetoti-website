import type { Metadata } from "next";
import MeetClient from "./MeetClient";

export const metadata: Metadata = {
  title: "Meeting Room | Steve Toti",
  description:
    "Join your video meeting with Toti, Stephen Totimeh's AI assistant.",
  robots: { index: false, follow: false },
};

export default function MeetPage() {
  return <MeetClient />;
}

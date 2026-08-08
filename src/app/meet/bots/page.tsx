import type { Metadata } from "next";
import BotsClient from "./BotsClient";

export const metadata: Metadata = {
  title: "Toti Bot Control",
  description: "Manage Toti's meeting attendance.",
  robots: { index: false, follow: false },
};

export default function BotsPage() {
  return <BotsClient />;
}

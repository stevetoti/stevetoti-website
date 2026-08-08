import type { Metadata } from "next";
import BookedClient from "./BookedClient";

export const metadata: Metadata = {
  title: "Booking Confirmed | Steve Toti",
  description: "Your discovery call with Toti is confirmed.",
  robots: { index: false, follow: false },
};

export default function BookedPage() {
  return <BookedClient />;
}

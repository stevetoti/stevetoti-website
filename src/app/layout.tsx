import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

export const metadata: Metadata = {
  metadataBase: new URL("https://stevetoti.com"),
  title: "Stephen Totimeh | AI Automation & Digital Solutions Expert",
  description:
    "Transform your business with AI automation, modern web development, and innovative digital solutions. Stephen Totimeh helps businesses scale globally from Vanuatu.",
  keywords: [
    "AI automation",
    "web development",
    "digital solutions",
    "business systems",
    "consulting",
    "Vanuatu",
    "Stephen Totimeh",
    "Pacific Wave Digital",
    "Global Digital Prime",
    "Rapid Entrepreneurs",
  ],
  authors: [{ name: "Stephen Totimeh" }],
  creator: "Stephen Totimeh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stevetoti.com",
    siteName: "Stephen Totimeh",
    title: "Stephen Totimeh | AI Automation & Digital Solutions Expert",
    description:
      "Transform your business with AI automation and innovative digital solutions.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Stephen Totimeh - Digital Solutions Expert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stephen Totimeh | AI Automation & Digital Solutions Expert",
    description:
      "Transform your business with AI automation and innovative digital solutions.",
    creator: "@stevetoti",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AnimatedBackground />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

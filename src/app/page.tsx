import Hero from "@/components/Hero";
import ServicesOverview from "@/components/ServicesOverview";
import AboutPreview from "@/components/AboutPreview";
import Testimonials from "@/components/Testimonials";
import YouTubeFeed from "@/components/YouTubeFeed";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <AboutPreview />
      <Testimonials />
      <YouTubeFeed />
      <CTASection />
    </>
  );
}

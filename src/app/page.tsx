import Hero from "@/components/Hero";
import MeetToti from "@/components/MeetToti";
import ServicesOverview from "@/components/ServicesOverview";
import AboutPreview from "@/components/AboutPreview";
import Testimonials from "@/components/Testimonials";
import YouTubeFeed from "@/components/YouTubeFeed";
import Newsletter from "@/components/Newsletter";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MeetToti />
      <ServicesOverview />
      <AboutPreview />
      <Testimonials />
      <YouTubeFeed />
      <Newsletter />
      <CTASection />
    </>
  );
}

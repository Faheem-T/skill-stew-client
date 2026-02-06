import { TopBar } from "../../../../shared/components/layout/TopBar";
import { HeroSection } from "../components/HeroSection";
import { InfoSection } from "../components/InfoSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { CTASection } from "../components/CTASection";
import { useRef } from "react";
import { ReviewsSection } from "../components/ReviewsSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { Footer } from "../components/Footer";

export const HomePage = () => {
  const sectionRef = useRef<null | HTMLDivElement>(null);

  function handleLearnMoreButtonClick() {
    const element = sectionRef.current as HTMLDivElement;
    element.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <TopBar />
      <HeroSection onLearnMoreButtonClick={handleLearnMoreButtonClick} />
      <InfoSection ref={sectionRef} />
      <FeaturesSection />
      <HowItWorksSection />
      <ReviewsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

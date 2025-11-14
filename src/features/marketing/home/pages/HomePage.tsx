import { TopBar } from "../components/TopBar";
import { HeroSection } from "../components/HeroSection";
import { InfoSection } from "../components/InfoSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { CTASection } from "../components/CTASection";
import { useRef } from "react";
import { ReviewsSection } from "../components/ReviewsSection";

export const HomePage = () => {
  const sectionRef = useRef<null | HTMLDivElement>(null);

  function handleLearnMoreButtonClick() {
    const element = sectionRef.current as HTMLDivElement;
    element.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <HeroSection onLearnMoreButtonClick={handleLearnMoreButtonClick} />
      <InfoSection ref={sectionRef} />
      <HowItWorksSection />
      <ReviewsSection />
      <CTASection />
      <div className="h-40"></div>
    </div>
  );
};

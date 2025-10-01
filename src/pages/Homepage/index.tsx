import { TopBar } from "./TopBar";
import { HeroSection } from "./HeroSection";
import { InfoSection } from "./InfoSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { CTASection } from "./CTASection";
import { useRef } from "react";
import { ReviewsSection } from "./ReviewsSection";

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

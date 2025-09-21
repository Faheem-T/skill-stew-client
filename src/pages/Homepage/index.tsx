import { TopBar } from "./TopBar";
import { HeroSection } from "./HeroSection";
import { InfoSection } from "./InfoSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { CTASection } from "./CTASection";

export const HomePage = () => {
  return (
    <div className="min-h-screen">
      <TopBar />
      <HeroSection />
      <InfoSection />
      <HowItWorksSection />
      <CTASection />
      <div className="h-40"></div>
    </div>
  );
};

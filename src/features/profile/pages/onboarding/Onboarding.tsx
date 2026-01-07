import { useState } from "react";
import { ProfileStep } from "./ProfileStep";
import { SkillSelectionStep } from "./SkillSelectionStep";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { StepIndicator } from "@/features/profile/components/StepIndicator";

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const totalSteps = 3;
  const stepTitles: Record<number, string> = {
    1: "Tell us about yourself",
    2: "Select your skills",
    3: "Complete your profile",
  };

  const handleStepChange = (newStep: number) => {
    setDirection(newStep > step ? "forward" : "backward");
    setStep(newStep);
  };

  // Define slide variants with dynamic custom data
  const slideVariants = {
    enter: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: "forward" | "backward") => ({
      zIndex: 0,
      x: direction === "forward" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  // Smooth transition configuration
  const slideTransition: Transition = {
    x: { type: "spring", stiffness: 300, damping: 30, mass: 1 },
    opacity: { duration: 0.1 },
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ProfileStep onComplete={() => handleStepChange(2)} />;
      case 2:
        return (
          <SkillSelectionStep
            onBack={() => handleStepChange(1)}
            onComplete={() => handleStepChange(3)}
          />
        );
      case 3:
        return (
          <div className="flex items-center justify-center min-h-screen">
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg"
            >
              Complete Onboarding
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full overflow-hidden max-w-3xl mx-auto">
      <StepIndicator
        currentStep={step}
        totalSteps={totalSteps}
        title={stepTitles[step] || ""}
      />
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          className="w-full"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

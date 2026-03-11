import { useState } from "react";
import { ProfileStep } from "./ProfileStep";
import { OfferedSkillsStep } from "./OfferedSkillsStep";
import { WantedSkillsStep } from "./WantedSkillsStep";
import { RecommendedUsersStep } from "./RecommendedUsersStep";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { StepIndicator } from "@/features/onboarding/components/StepIndicator";
import { CheckCircle2, Sparkles } from "lucide-react";

interface SkillWithProficiency {
  skill: {
    id: string;
    name: string;
    alternateNames: string[];
  };
  proficiency:
    | "Beginner"
    | "Advanced Beginner"
    | "Intermediate"
    | "Proficient"
    | "Expert";
}

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [offeredSkills, setOfferedSkills] = useState<SkillWithProficiency[]>(
    [],
  );
  const [wantedSkills, setWantedSkills] = useState<
    SkillWithProficiency["skill"][]
  >([]);

  const totalSteps = 5;
  const stepTitles: Record<number, string> = {
    1: "Tell us about yourself",
    2: "Skills you can offer",
    3: "Skills you want to learn",
    4: "Meet the community",
    5: "Complete your profile",
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
          <OfferedSkillsStep
            onBack={() => handleStepChange(1)}
            offeredSkills={offeredSkills}
            onUpdate={(skills) => setOfferedSkills(skills)}
            onComplete={(skills) => {
              setOfferedSkills(skills);
              handleStepChange(3);
            }}
          />
        );
      case 3:
        return (
          <WantedSkillsStep
            onBack={() => handleStepChange(2)}
            offeredSkills={offeredSkills}
            wantedSkills={wantedSkills}
            onUpdate={(skills) => setWantedSkills(skills)}
            onComplete={() => handleStepChange(4)}
          />
        );
      case 4:
        return <RecommendedUsersStep onComplete={() => handleStepChange(5)} />;
      case 5:
        return (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mb-6"
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-50 border border-green-100/50">
                <CheckCircle2 className="w-10 h-10 text-green-600" strokeWidth={1.5} />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
              className="text-2xl font-bold text-slate-900 text-center mb-3"
            >
              Profile Complete
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
              className="text-slate-600 text-center mb-8 max-w-sm leading-relaxed"
            >
              Your profile is all set. You're ready to start exchanging skills
              with our community.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
              onClick={onComplete}
              className="px-8 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Get Started
            </motion.button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-linear-to-br from-slate-50 via-slate-50 to-slate-100 flex flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-pulse" />

      {/* Header with gradient */}
      <div className="bg-primary px-8 py-3 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
          <p className="text-primary-foreground text-xs font-medium">
            Setup Your Profile
          </p>
        </div>
        <h1 className="text-xl font-bold text-primary-foreground">
          {stepTitles[step] || "Welcome"}
        </h1>
      </div>

      {/* Step Indicator */}
      <div className="px-8 py-4 border-b border-slate-200 bg-white shrink-0">
        <StepIndicator currentStep={step} totalSteps={totalSteps} title="" />
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="relative overflow-x-hidden h-full">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="w-full h-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

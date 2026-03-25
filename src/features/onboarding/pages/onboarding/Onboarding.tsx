import { useState } from "react";
import { ProfileStep } from "./ProfileStep";
import { OfferedSkillsStep } from "./OfferedSkillsStep";
import { WantedSkillsStep } from "./WantedSkillsStep";
import { RecommendedUsersStep } from "./RecommendedUsersStep";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { StepIndicator } from "@/features/onboarding/components/StepIndicator";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

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
    x: { duration: 0.25, ease: "easeOut" },
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
          <div className="flex flex-col items-center justify-center px-8 py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mb-6"
            >
              <div className="bg-success-muted border-border flex h-20 w-20 items-center justify-center rounded-full border">
                <CheckCircle2 className="text-success h-10 w-10" strokeWidth={1.5} />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
              className="mb-3 text-2xl font-semibold text-foreground"
            >
              Profile Complete
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
              className="text-muted-foreground mb-8 max-w-sm leading-relaxed"
            >
              Your profile is all set. You're ready to start exchanging skills
              with our community.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
            >
              <Button onClick={onComplete} className="px-8">
                Get Started
              </Button>
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background flex h-full w-full flex-col overflow-hidden">
      <div className="bg-card border-border shrink-0 border-b px-8 py-4">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="text-primary h-4 w-4" strokeWidth={1.5} />
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
            Setup Your Profile
          </p>
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          {stepTitles[step] || "Welcome"}
        </h1>
      </div>

      <div className="bg-background border-border shrink-0 border-b px-8 py-4">
        <StepIndicator currentStep={step} totalSteps={totalSteps} title="" />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
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

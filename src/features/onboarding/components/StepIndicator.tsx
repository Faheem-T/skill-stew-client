import { motion } from "motion/react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  className,
}) => {
  const stepArray = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Step indicators */}
      <div className="flex justify-between items-center gap-1">
        {stepArray.map((step) => (
          <motion.div
            key={step}
            className="flex-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: step * 0.1 }}
          >
            <div
              className={`relative h-2 rounded-full transition-colors ${
                step <= currentStep
                  ? "bg-primary"
                  : "bg-slate-300"
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Step number display */}
      <div className="text-center">
        <span className="text-sm font-semibold text-slate-700">
          Step <span className="text-primary">{currentStep}</span> of {totalSteps}
        </span>
      </div>
    </div>
  );
};

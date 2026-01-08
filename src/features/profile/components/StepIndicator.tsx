import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  title,
  className,
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <DialogHeader className={`mb-8 ${className || ""}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary rounded-full opacity-20"></div>
          <div className="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
            {currentStep}
          </div>
        </div>
        <div className="flex-1">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </DialogDescription>
        </div>
      </div>

      <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </DialogHeader>
  );
};

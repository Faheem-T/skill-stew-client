import { Check } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { WORKSHOP_STEPS, type WizardStep } from "@/features/workshop/lib/wizard";

export const WorkshopStepRail = ({
  currentStep,
  stepAvailability,
  onSelectStep,
}: {
  currentStep: WizardStep;
  stepAvailability: Record<WizardStep, boolean>;
  onSelectStep: (step: WizardStep) => void;
}) => {
  return (
    <Card className="border-border/80 shadow-none">
      <CardContent className="grid gap-3 pt-6 md:grid-cols-4">
        {WORKSHOP_STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isAvailable = stepAvailability[step.id];

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectStep(step.id)}
              className={`rounded-lg border px-4 py-4 text-left transition-colors ${
                isActive
                  ? "border-primary bg-secondary text-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              } ${!isAvailable ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em]">
                  Step {step.id}
                </span>
                {isAvailable && step.id < currentStep && (
                  <Check className="h-4 w-4 text-success" />
                )}
              </div>
              <p className="text-sm font-medium text-foreground">
                {step.title}
              </p>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};

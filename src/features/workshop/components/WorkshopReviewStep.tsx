import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Loader2,
  Save,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  InlineStatus,
  ReviewField,
  ReviewSection,
} from "@/features/workshop/components/WorkshopWizardShared";
import { formatWorkshopStructure } from "@/features/workshop/lib/workshop";
import type {
  SessionEditorItem,
  Workshop,
} from "@/features/workshop/types/types";
import type {
  ReviewErrorGroup,
  WizardStep,
} from "@/features/workshop/lib/wizard";

export const WorkshopReviewStep = ({
  workshop,
  sessionEditors,
  reviewErrors,
  reviewMessage,
  isPending,
  onBack,
  onPublish,
  onJumpToStep,
}: {
  workshop: Workshop | null;
  sessionEditors: SessionEditorItem[];
  reviewErrors: ReviewErrorGroup[];
  reviewMessage: string | null;
  isPending: boolean;
  onBack: () => void;
  onPublish: () => Promise<void>;
  onJumpToStep: (step: WizardStep) => void;
}) => {
  const sectionStepMap: Record<ReviewErrorGroup["section"], WizardStep> = {
    basics: 1,
    schedule: 2,
    sessions: 3,
    review: 4,
  };

  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold text-foreground">
          Step 4. Review and publish
        </CardTitle>
        <CardDescription className="leading-6">
          Confirm the workshop summary, then publish.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 border-t border-border/70 pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <ReviewSection
            icon={<CalendarDays className="h-4 w-4" />}
            title="Workshop basics"
            actionLabel="Edit basics"
            onAction={() => onJumpToStep(1)}
          >
            <ReviewField
              label="Title"
              value={workshop?.title ?? "Untitled workshop"}
            />
            <ReviewField
              label="Audience"
              value={workshop?.targetAudience ?? "Not provided"}
            />
            <ReviewField
              label="Max cohort size"
              value={String(workshop?.maxCohortSize ?? "Not set")}
            />
            <ReviewField
              label="Description"
              value={workshop?.description ?? "Not provided"}
            />
          </ReviewSection>

          <ReviewSection
            icon={<Clock3 className="h-4 w-4" />}
            title="Schedule"
            actionLabel="Edit schedule"
            onAction={() => onJumpToStep(2)}
          >
            <ReviewField
              label="Timezone"
              value={workshop?.timezone ?? "Not set"}
            />
            <ReviewField
              label="Sessions"
              value={String(sessionEditors.length)}
            />
          </ReviewSection>
        </div>

        <ReviewSection
          icon={<Save className="h-4 w-4" />}
          title="Session details"
          actionLabel="Edit sessions"
          onAction={() => onJumpToStep(3)}
        >
          <div className="space-y-3">
            {sessionEditors.map((session) => (
              <div
                key={session.id}
                className="rounded-lg border border-border bg-background px-4 py-3"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {formatWorkshopStructure(
                    session.weekNumber,
                    session.dayOfWeek,
                    session.sessionOrder,
                  )}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {session.title || "Missing session title"}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {session.description || "No session description provided."}
                </p>
              </div>
            ))}
          </div>
        </ReviewSection>

        {reviewMessage && (
          <InlineStatus
            variant={reviewErrors.length > 0 ? "error" : "default"}
            icon={
              reviewErrors.length > 0 ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )
            }
            title={
              reviewErrors.length > 0 ? "Publishing blocked" : "Review ready"
            }
          >
            {reviewMessage}
          </InlineStatus>
        )}

        {reviewErrors.length > 0 && (
          <div className="space-y-4">
            {reviewErrors.map((group) => (
              <div
                key={group.section}
                className="rounded-lg border border-destructive/30 bg-card px-4 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {group.section === "basics"
                        ? "Basics"
                        : group.section === "schedule"
                          ? "Schedule"
                          : group.section === "sessions"
                            ? "Session details"
                            : "Review"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Resolve these backend completeness checks before
                      publishing again.
                    </p>
                  </div>
                  {group.section !== "review" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        onJumpToStep(sectionStepMap[group.section])
                      }
                    >
                      Open step {sectionStepMap[group.section]}
                    </Button>
                  )}
                </div>
                <ul className="mt-3 space-y-2 text-sm text-destructive">
                  {group.items.map((item) => (
                    <li key={`${group.section}-${item.field}-${item.message}`}>
                      {item.message}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between border-t border-border/70 pt-6">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to session details
        </Button>
        <Button
          type="button"
          onClick={() => void onPublish()}
          disabled={isPending}
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Publish workshop
        </Button>
      </CardFooter>
    </Card>
  );
};

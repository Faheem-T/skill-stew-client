import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { formatWorkshopStructure } from "@/features/workshop/lib/workshop";
import { SaveStateBadge } from "@/features/workshop/components/WorkshopWizardShared";
import type { SessionEditorItem } from "@/features/workshop/types/types";

export const WorkshopSessionDetailsStep = ({
  items,
  isLocked,
  onBack,
  onNext,
  onFieldChange,
  onSave,
}: {
  items: SessionEditorItem[];
  isLocked: boolean;
  onBack: () => void;
  onNext: () => void;
  onFieldChange: (
    sessionId: string,
    field: "title" | "description" | "startTime",
    value: string,
  ) => void;
  onSave: (
    sessionId: string,
    payload: Pick<SessionEditorItem, "title" | "description" | "startTime">,
  ) => Promise<void>;
}) => {
  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold text-foreground">
          Step 3. Add titles and final session notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 border-t border-border/70 pt-6">
        {items.map((item) => (
          <SessionEditorCard
            key={item.id}
            item={item}
            disabled={isLocked}
            onFieldChange={onFieldChange}
            onSave={onSave}
          />
        ))}
      </CardContent>
      <CardFooter className="justify-between border-t border-border/70 pt-6">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to schedule
        </Button>
        <Button type="button" onClick={onNext}>
          Review and publish
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const SessionEditorCard = ({
  item,
  disabled,
  onFieldChange,
  onSave,
}: {
  item: SessionEditorItem;
  disabled: boolean;
  onFieldChange: (
    sessionId: string,
    field: "title" | "description" | "startTime",
    value: string,
  ) => void;
  onSave: (
    sessionId: string,
    payload: Pick<SessionEditorItem, "title" | "description" | "startTime">,
  ) => Promise<void>;
}) => {
  const trimmedTitle = item.title.trim();
  const trimmedDescription = item.description.trim();
  const missingTitle = trimmedTitle.length === 0;
  const missingDescription = trimmedDescription.length === 0;
  const validationMessage =
    missingTitle && missingDescription
      ? "Add both a session title and description before this session can be saved."
      : missingTitle
        ? "Add a session title before this session can be saved."
        : missingDescription
          ? "Add a session description before this session can be saved."
          : null;

  const debouncedFields = useDebounce(
    {
      title: item.title,
      description: item.description,
      startTime: item.startTime,
    },
    700,
  );
  const lastSavedPayload = useRef(JSON.stringify(debouncedFields));
  const hasMounted = useRef(false);

  useEffect(() => {
    const serializedPayload = JSON.stringify(debouncedFields);

    if (!hasMounted.current) {
      hasMounted.current = true;
      lastSavedPayload.current = serializedPayload;
      return;
    }

    if (serializedPayload === lastSavedPayload.current) {
      return;
    }

    if (!debouncedFields.title.trim() || !debouncedFields.description.trim()) {
      return;
    }

    lastSavedPayload.current = serializedPayload;
    void onSave(item.id, debouncedFields);
  }, [debouncedFields, item.id, onSave]);

  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {formatWorkshopStructure(
              item.weekNumber,
              item.dayOfWeek,
              item.sessionOrder,
            )}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            Session details
          </p>
        </div>
        <SaveStateBadge state={item.saveState ?? "idle"} />
      </div>

      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Session title
            </label>
            <Input
              value={item.title}
              disabled={disabled}
              aria-invalid={missingTitle}
              onChange={(event) =>
                onFieldChange(item.id, "title", event.target.value)
              }
              placeholder="Week 1 kickoff"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Start time
            </label>
            <Input
              type="time"
              value={item.startTime}
              disabled={disabled}
              onChange={(event) =>
                onFieldChange(item.id, "startTime", event.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Description
          </label>
          <Textarea
            value={item.description}
            disabled={disabled}
            aria-invalid={missingDescription}
            className="min-h-24 resize-none"
            onChange={(event) =>
              onFieldChange(item.id, "description", event.target.value)
            }
            placeholder="Add the session agenda, focus, or prep guidance."
          />
        </div>

        {validationMessage && (
          <p className="text-sm text-destructive">{validationMessage}</p>
        )}

        {item.errorMessage && (
          <p className="text-sm text-destructive">{item.errorMessage}</p>
        )}
      </div>
    </div>
  );
};

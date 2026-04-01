import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import TimezoneSelect from "react-timezone-select";
import { AlertCircle, ArrowLeft, Check, Loader2, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { InlineStatus } from "@/features/workshop/components/WorkshopWizardShared";
import { formatWorkshopStructure, WEEKDAY_OPTIONS } from "@/features/workshop/lib/workshop";
import type { ScheduleDraftSession } from "@/features/workshop/types/types";

export const WorkshopScheduleStep = ({
  timezone,
  sessions,
  errors,
  message,
  isPending,
  onTimezoneChange,
  onAddSession,
  onRemoveSession,
  onUpdateSession,
  onSubmit,
  onBack,
}: {
  timezone: string;
  sessions: ScheduleDraftSession[];
  errors: string[];
  message: string | null;
  isPending: boolean;
  onTimezoneChange: (value: string) => void;
  onAddSession: () => void;
  onRemoveSession: (localId: string) => void;
  onUpdateSession: (
    localId: string,
    field: keyof Omit<ScheduleDraftSession, "localId">,
    value: number | string,
  ) => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}) => {
  const previousOrderRef = useRef<string[]>(
    sessions.map((session) => session.localId),
  );
  const [movedToFrontId, setMovedToFrontId] = useState<string | null>(null);

  useEffect(() => {
    const currentOrder = sessions.map((session) => session.localId);
    const currentFirstId = currentOrder[0];
    const previousIndex = currentFirstId
      ? previousOrderRef.current.indexOf(currentFirstId)
      : -1;

    if (currentFirstId && previousIndex > 0) {
      setMovedToFrontId(currentFirstId);

      const timeoutId = window.setTimeout(() => {
        setMovedToFrontId((currentId) =>
          currentId === currentFirstId ? null : currentId,
        );
      }, 650);

      previousOrderRef.current = currentOrder;

      return () => window.clearTimeout(timeoutId);
    }

    previousOrderRef.current = currentOrder;
  }, [sessions]);

  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold text-foreground">
          Step 2. Build the structural schedule
        </CardTitle>
        <CardDescription className="leading-6">
          Set the workshop timezone here and define the weekly session
          structure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 border-t border-border/70 pt-6">
        <div className="grid gap-5 md:grid-cols-[minmax(0,280px)_1fr]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Workshop timezone
            </label>
            <div className="timezone-select">
              <TimezoneSelect
                value={timezone}
                onChange={(selectedTimezone) =>
                  onTimezoneChange(selectedTimezone.value)
                }
              />
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Session start times are interpreted as wall-clock times in this
              timezone.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {sessions.map((session, index) => (
            <motion.div
              key={session.localId}
              layout
              animate={
                movedToFrontId === session.localId
                  ? {
                      x: [0, -8, 0],
                      scale: [1, 1.01, 1],
                    }
                  : undefined
              }
              transition={{
                layout: {
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                },
                duration: movedToFrontId === session.localId ? 0.38 : 0.2,
                ease: "easeOut",
              }}
              className="grid gap-4 rounded-lg border border-border bg-background p-4 md:grid-cols-[96px_1fr_124px_auto]"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Week</label>
                <Input
                  type="number"
                  min={1}
                  value={session.weekNumber}
                  onChange={(event) =>
                    onUpdateSession(
                      session.localId,
                      "weekNumber",
                      Number(event.target.value || 0),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Day of week
                </label>
                <Select
                  value={String(session.dayOfWeek)}
                  onValueChange={(value) =>
                    onUpdateSession(session.localId, "dayOfWeek", Number(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEKDAY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Start time
                </label>
                <Input
                  type="time"
                  value={session.startTime}
                  onChange={(event) =>
                    onUpdateSession(
                      session.localId,
                      "startTime",
                      event.target.value,
                    )
                  }
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onRemoveSession(session.localId)}
                  disabled={sessions.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
              <div className="md:col-span-4 flex flex-wrap items-center gap-3">
                <Badge
                  variant="secondary"
                  className="rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]"
                >
                  Session {session.sessionOrder}
                </Badge>
                <p className="text-xs leading-5 text-muted-foreground">
                  Session {index + 1}:{" "}
                  {formatWorkshopStructure(
                    session.weekNumber,
                    session.dayOfWeek,
                    session.sessionOrder,
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <Button type="button" variant="outline" onClick={onAddSession}>
          <Plus className="h-4 w-4" />
          Add session row
        </Button>

        {message && (
          <InlineStatus icon={<Check className="h-4 w-4" />} title="Schedule saved">
            {message}
          </InlineStatus>
        )}

        {errors.length > 0 && (
          <InlineStatus
            variant="error"
            icon={<AlertCircle className="h-4 w-4" />}
            title="Fix the schedule"
          >
            <ul className="space-y-1">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </InlineStatus>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-6">
          <Button type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back to basics
          </Button>
          <Button type="button" onClick={() => void onSubmit()} disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

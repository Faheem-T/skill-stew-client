import type { ReactNode } from "react";
import { AlertCircle, Check, Loader2, RefreshCcw } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type {
  SessionEditorItem,
  Workshop,
} from "@/features/workshop/types/types";

export const InlineStatus = ({
  children,
  title,
  icon,
  variant = "default",
}: {
  children: ReactNode;
  title: string;
  icon: ReactNode;
  variant?: "default" | "error";
}) => {
  return (
    <Alert
      className={
        variant === "error"
          ? "border-destructive/30 bg-card text-destructive"
          : "border-border bg-info-muted text-foreground"
      }
    >
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription
        className={
          variant === "error" ? "text-destructive/90" : "text-muted-foreground"
        }
      >
        {children}
      </AlertDescription>
    </Alert>
  );
};

export const SaveStateBadge = ({
  state,
}: {
  state: NonNullable<SessionEditorItem["saveState"]>;
}) => {
  if (state === "saving") {
    return (
      <Badge
        variant="secondary"
        className="rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]"
      >
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        Saving
      </Badge>
    );
  }

  if (state === "saved") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex h-5 w-5 items-center justify-center text-success">
            <Check className="h-4 w-4" strokeWidth={2.25} />
          </span>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>Saved</TooltipContent>
      </Tooltip>
    );
  }

  if (state === "error") {
    return (
      <Badge
        variant="secondary"
        className="rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-destructive"
      >
        <RefreshCcw className="mr-1 h-3 w-3" />
        Error
      </Badge>
    );
  }

  return null;
};

export const ReviewSection = ({
  title,
  actionLabel,
  onAction,
  icon,
  children,
}: {
  title: string;
  actionLabel: string;
  onAction: () => void;
  icon: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-foreground">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <Button type="button" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
      {children}
    </div>
  );
};

export const ReviewField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="border-border flex flex-col gap-1 border-b py-3 last:border-b-0 last:pb-0 first:pt-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
};

export const WorkshopSummaryCard = ({
  title,
  description,
  targetAudience,
  maxCohortSize,
  timezone,
  sessionCount,
  status,
  bannerPreview,
}: {
  title: string;
  description: string;
  targetAudience: string;
  maxCohortSize: string;
  timezone: string;
  sessionCount: number;
  status: Workshop["status"];
  bannerPreview: string | null;
}) => {
  return (
    <Card className="border-border/80 sticky top-20 shadow-none">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Workshop snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 border-t border-border/70 pt-6">
        {bannerPreview ? (
          <img
            src={bannerPreview}
            alt="Workshop banner"
            className="h-36 w-full rounded-lg border border-border object-cover"
          />
        ) : (
          <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/40 text-sm text-muted-foreground">
            No banner
          </div>
        )}
        <div className="space-y-2">
          <Badge
            variant="secondary"
            className="rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]"
          >
            {status}
          </Badge>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <div className="grid gap-3 text-sm">
          <SummaryRow label="Audience" value={targetAudience} />
          <SummaryRow label="Max cohort size" value={maxCohortSize} />
          <SummaryRow label="Timezone" value={timezone} />
          <SummaryRow label="Sessions" value={String(sessionCount)} />
        </div>
      </CardContent>
    </Card>
  );
};

export const CompletionRulesCard = ({
  hasTitle,
  hasCohortSize,
  hasTimezone,
  hasSchedule,
  everySessionTitled,
}: {
  hasTitle: boolean;
  hasCohortSize: boolean;
  hasTimezone: boolean;
  hasSchedule: boolean;
  everySessionTitled: boolean;
}) => {
  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Completion rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 border-t border-border/70 pt-6 text-sm text-muted-foreground">
        <ChecklistItem checked={hasTitle} label="Workshop title" />
        <ChecklistItem checked={hasCohortSize} label="Cohort size" />
        <ChecklistItem checked={hasTimezone} label="Timezone selected" />
        <ChecklistItem checked={hasSchedule} label="Schedule saved" />
        <ChecklistItem
          checked={everySessionTitled}
          label="Every session titled"
        />
      </CardContent>
    </Card>
  );
};

export const SummaryMetric = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-border bg-background px-3 py-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
};

const ChecklistItem = ({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) => {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          checked
            ? "border-success bg-success-muted text-success"
            : "border-border bg-background text-muted-foreground"
        }`}
      >
        {checked ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <AlertCircle className="h-3.5 w-3.5" />
        )}
      </span>
      <span>{label}</span>
    </div>
  );
};

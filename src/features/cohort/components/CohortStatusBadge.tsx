import { Badge } from "@/shared/components/ui/badge";
import {
  COHORT_STATUS_LABELS,
  getCohortStatusTone,
} from "@/features/cohort/lib/cohort";
import type { CohortStatus } from "@/features/cohort/types/types";

export const CohortStatusBadge = ({ status }: { status: CohortStatus }) => {
  const tone = getCohortStatusTone(status);

  return (
    <Badge
      variant={tone === "secondary" ? "secondary" : "outline"}
      className={
        tone === "live"
          ? "border-live/20 bg-live-muted text-live"
          : tone === "warning"
            ? "border-warning/20 bg-warning-muted text-warning"
            : "rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]"
      }
    >
      {COHORT_STATUS_LABELS[status]}
    </Badge>
  );
};

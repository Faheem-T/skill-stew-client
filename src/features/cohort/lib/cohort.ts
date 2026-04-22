import { formatWorkshopStructure } from "@/features/workshop/lib/workshop";
import type {
  CohortDetails,
  CohortListItem,
  CohortSession,
  CohortStatus,
} from "@/features/cohort/types/types";

export const COHORT_STATUS_LABELS: Record<CohortStatus, string> = {
  upcoming: "Upcoming",
  active: "Active",
  completed: "Completed",
};

export const getCohortStatusTone = (status: CohortStatus) => {
  if (status === "active") {
    return "live";
  }

  if (status === "completed") {
    return "secondary";
  }

  return "warning";
};

export const formatCalendarDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(`${value}T00:00:00`));

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const formatCohortSeatLabel = (
  cohort: Pick<
    CohortListItem,
    "activeSeats" | "heldSeats" | "availableSeats" | "maxStudents"
  >,
) => `${cohort.availableSeats} open of ${cohort.maxStudents}`;

export const getCohortSessionLabel = (
  session: Pick<CohortSession, "weekNumber" | "dayOfWeek" | "sessionOrder">,
) =>
  formatWorkshopStructure(
    session.weekNumber,
    session.dayOfWeek,
    session.sessionOrder,
  );

export const canEditCohortPricing = (cohort: CohortDetails) =>
  cohort.heldSeats === 0;

export const canDeleteCohort = (cohort: CohortDetails) =>
  cohort.heldSeats === 0;

export const isPaidCohort = (cohort: Pick<CohortListItem, "spotPriceAmount">) =>
  cohort.spotPriceAmount > 0;

export const summarizeWorkshopCohorts = (
  cohorts: CohortListItem[] | undefined,
): string | null => {
  if (!cohorts || cohorts.length === 0) {
    return null;
  }

  const counts = cohorts.reduce<Record<CohortStatus, number>>(
    (acc, cohort) => {
      acc[cohort.status] += 1;
      return acc;
    },
    { upcoming: 0, active: 0, completed: 0 },
  );

  const parts = [
    counts.upcoming > 0 ? `${counts.upcoming} upcoming` : null,
    counts.active > 0 ? `${counts.active} active` : null,
    counts.completed > 0 ? `${counts.completed} completed` : null,
  ].filter(Boolean);

  return `${cohorts.length} cohort${cohorts.length === 1 ? "" : "s"}${
    parts.length > 0 ? ` • ${parts.join(", ")}` : ""
  }`;
};

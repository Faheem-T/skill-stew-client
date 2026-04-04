import type {
  CohortEnrollmentStatus,
  CohortListItem,
} from "@/features/cohort/types/types";

export type WorkshopStatus = "draft" | "published" | "archived";

export type ApiErrorItem = {
  message: string;
  field?: string;
};

export type WorkshopSession = {
  id: string;
  weekNumber: number;
  dayOfWeek: number;
  sessionOrder: number;
  title?: string | null;
  description?: string | null;
  startTime: string;
};

export type Workshop = {
  id: string;
  expertId: string;
  title: string;
  description: string | null;
  targetAudience: string | null;
  bannerImageKey: string | null;
  bannerImageUrl: string | null;
  maxCohortSize: number;
  status: WorkshopStatus;
  sessions: WorkshopSession[];
  timezone: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkshopListItem = {
  id: string;
  title: string;
  description: string | null;
  bannerImageKey: string | null;
  bannerImageUrl: string | null;
  status: WorkshopStatus;
  timezone: string | null;
  updatedAt: string;
  sessionCount: number;
};

export type PublicWorkshopCohortListItem = CohortListItem & {
  currentUserEnrollment:
    | {
        membershipId: string | null;
        status: CohortEnrollmentStatus;
        joinedAt: string | null;
        expiresAt: string | null;
        requiresPayment: boolean;
      }
    | null;
};

export type PublishedWorkshopDetails = {
  id: string;
  expertId: string;
  expertName: string | null;
  title: string;
  description: string | null;
  targetAudience: string | null;
  bannerImageKey: string | null;
  bannerImageUrl: string | null;
  status: "published";
  timezone: string | null;
  sessions: WorkshopSession[];
  cohorts: PublicWorkshopCohortListItem[];
};

export type WorkshopBasicsDraft = {
  title: string;
  description: string;
  targetAudience: string;
  maxCohortSize: string;
  bannerImageKey: string | null;
};

export type ScheduleDraftSession = {
  localId: string;
  weekNumber: number;
  dayOfWeek: number;
  sessionOrder: number;
  startTime: string;
};

export type ScheduleDraft = {
  timezone: string;
  sessions: ScheduleDraftSession[];
};

export type SessionEditorItem = {
  id: string;
  weekNumber: number;
  dayOfWeek: number;
  sessionOrder: number;
  title: string;
  description: string;
  startTime: string;
  saveState?: "idle" | "saving" | "saved" | "error";
  errorMessage?: string | null;
};

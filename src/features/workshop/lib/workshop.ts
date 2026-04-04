import type { ApiErrorResponseType } from "@/shared/api/baseApi";
import type { ApiErrorItem, SessionEditorItem, WorkshopSession } from "@/features/workshop/types/types";

export const WEEKDAY_OPTIONS = [
  { value: 0, label: "Monday" },
  { value: 1, label: "Tuesday" },
  { value: 2, label: "Wednesday" },
  { value: 3, label: "Thursday" },
  { value: 4, label: "Friday" },
  { value: 5, label: "Saturday" },
  { value: 6, label: "Sunday" },
] as const;

export const toJavaScriptDayOfWeek = (dayOfWeek: number) => (dayOfWeek + 1) % 7;

export const sortWorkshopSessions = <T extends Pick<WorkshopSession, "weekNumber" | "dayOfWeek" | "sessionOrder">>(
  sessions: T[],
) => {
  return [...sessions].sort((left, right) => {
    if (left.weekNumber !== right.weekNumber) {
      return left.weekNumber - right.weekNumber;
    }

    if (left.dayOfWeek !== right.dayOfWeek) {
      return left.dayOfWeek - right.dayOfWeek;
    }

    return left.sessionOrder - right.sessionOrder;
  });
};

export const toSessionEditorItems = (sessions: WorkshopSession[]): SessionEditorItem[] => {
  return sortWorkshopSessions(sessions).map((session) => ({
    ...session,
    title: session.title ?? "",
    description: session.description ?? "",
    saveState: "idle",
    errorMessage: null,
  }));
};

export const getApiErrorItems = (error: ApiErrorResponseType): ApiErrorItem[] => {
  return error.response?.data?.errors ?? [];
};

export const getGeneralErrorMessage = (
  error: ApiErrorResponseType,
  fallback: string,
): string => {
  const firstMessage = getApiErrorItems(error)[0]?.message;
  return firstMessage ?? fallback;
};

export const mapErrorsByField = (errors: ApiErrorItem[]) => {
  return errors.reduce<Record<string, string[]>>((acc, item) => {
    const key = item.field ?? "root";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item.message);
    return acc;
  }, {});
};

export const getPublishSection = (field?: string) => {
  if (!field) {
    return "review";
  }

  if (["title", "description", "targetAudience", "maxCohortSize", "bannerImageKey"].includes(field)) {
    return "basics";
  }

  if (field === "timezone") {
    return "schedule";
  }

  if (field.startsWith("sessions")) {
    return "sessions";
  }

  return "review";
};

export const formatWorkshopStructure = (
  weekNumber: number,
  dayOfWeek: number,
  sessionOrder: number,
) => {
  const weekday = WEEKDAY_OPTIONS.find((option) => option.value === dayOfWeek)?.label ?? "Unknown day";
  return `Week ${weekNumber} • ${weekday} • Session ${sessionOrder}`;
};

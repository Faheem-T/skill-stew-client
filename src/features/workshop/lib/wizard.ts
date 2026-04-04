import type { ApiErrorItem, ScheduleDraftSession } from "@/features/workshop/types/types";

export const WORKSHOP_STEPS = [
  {
    id: 1,
    title: "Basics",
    description: "Title, audience, cohort size, and banner",
  },
  {
    id: 2,
    title: "Schedule",
    description: "Timezone and session structure",
  },
  {
    id: 3,
    title: "Session details",
    description: "Titles, descriptions, and final times",
  },
  {
    id: 4,
    title: "Review",
    description: "Final checks before publishing",
  },
] as const;

export type WizardStep = (typeof WORKSHOP_STEPS)[number]["id"];

export type WizardStatus =
  | { kind: "ready" }
  | { kind: "locked"; message: string }
  | { kind: "forbidden"; message: string }
  | { kind: "missing"; message: string }
  | { kind: "published" };

export type ReviewErrorGroup = {
  section: "basics" | "schedule" | "sessions" | "review";
  items: ApiErrorItem[];
};

export const createDefaultScheduleSession = (
  index: number,
): ScheduleDraftSession => ({
  localId: crypto.randomUUID(),
  weekNumber: 1,
  dayOfWeek: 0,
  sessionOrder: index + 1,
  startTime: "18:00",
});

export const createNextScheduleSession = (
  sessions: ScheduleDraftSession[],
): ScheduleDraftSession => {
  const previousSession = sessions[sessions.length - 1];

  if (!previousSession) {
    return createDefaultScheduleSession(0);
  }

  return {
    localId: crypto.randomUUID(),
    weekNumber: previousSession.weekNumber + 1,
    dayOfWeek: previousSession.dayOfWeek,
    sessionOrder: previousSession.sessionOrder + 1,
    startTime: previousSession.startTime,
  };
};

export const getBrowserTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "";

export const normalizeScheduleSessions = (sessions: ScheduleDraftSession[]) => {
  const groupedSessionCounts = new Map<string, number>();

  return [...sessions]
    .sort((left, right) => {
      if (left.weekNumber !== right.weekNumber) {
        return left.weekNumber - right.weekNumber;
      }

      if (left.dayOfWeek !== right.dayOfWeek) {
        return left.dayOfWeek - right.dayOfWeek;
      }

      if (left.startTime !== right.startTime) {
        return left.startTime.localeCompare(right.startTime);
      }

      return left.localId.localeCompare(right.localId);
    })
    .map((session) => {
      const groupKey = `${session.weekNumber}-${session.dayOfWeek}`;
      const nextOrder = (groupedSessionCounts.get(groupKey) ?? 0) + 1;
      groupedSessionCounts.set(groupKey, nextOrder);

      return {
        ...session,
        sessionOrder: nextOrder,
      };
    });
};

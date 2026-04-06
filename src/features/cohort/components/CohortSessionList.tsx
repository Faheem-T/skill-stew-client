import { CalendarDays, Clock3 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  formatCalendarDate,
  formatDateTime,
  getCohortSessionLabel,
} from "@/features/cohort/lib/cohort";
import type { CohortSession } from "@/features/cohort/types/types";

export const CohortSessionList = ({
  sessions,
  title = "Session calendar",
  showDerivedDate = true,
}: {
  sessions: CohortSession[];
  title?: string;
  showDerivedDate?: boolean;
}) => {
  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 border-t border-border/70 pt-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="rounded-lg border border-border bg-background px-4 py-4"
          >
            <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              {getCohortSessionLabel(session)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-foreground">
                {session.title || "Untitled session"}
              </p>
              <Badge
                variant="secondary"
                className="rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]"
              >
                {session.startTime}
              </Badge>
            </div>
            {showDerivedDate ? (
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span>{formatCalendarDate(session.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" />
                  <span>{formatDateTime(session.startsAt)}</span>
                </div>
              </div>
            ) : null}
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {session.description || "No session description provided."}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

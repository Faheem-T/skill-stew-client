import { CalendarDays, PencilLine, Plus, Users } from "lucide-react";
import { Link } from "react-router";
import { useExpertCohorts } from "@/features/cohort/hooks/useExpertCohorts";
import {
  formatCalendarDate,
  formatCohortSeatLabel,
  formatCurrencyAmount,
} from "@/features/cohort/lib/cohort";
import { CohortStatusBadge } from "@/features/cohort/components/CohortStatusBadge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FetchingState } from "@/shared/components/ui/fetching-state";
import { RoutePath } from "@/shared/config/routes";
import type { WorkshopStatus } from "@/features/workshop/types/types";

const getCreatePath = (workshopId: string) =>
  RoutePath.ExpertWorkshopCohortCreate.replace(":workshopId", workshopId);

const getDetailPath = (workshopId: string, cohortId: string) =>
  RoutePath.ExpertWorkshopCohortDetail.replace(
    ":workshopId",
    workshopId,
  ).replace(":cohortId", cohortId);

export const ExpertWorkshopCohortSection = ({
  workshopId,
  workshopStatus,
}: {
  workshopId: string;
  workshopStatus: WorkshopStatus;
}) => {
  const {
    data: cohorts,
    isLoading,
    error,
    refetch,
  } = useExpertCohorts({
    workshopId,
  });

  const canCreate = workshopStatus === "published";

  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground">
            Cohorts
          </CardTitle>
        </div>
        {canCreate ? (
          <Button
            asChild
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Link to={getCreatePath(workshopId)}>
              <Plus className="h-4 w-4" />
              Create cohort
            </Link>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="border-t border-border/70 pt-6">
        {workshopStatus !== "published" ? (
          <div className="rounded-lg border border-border bg-secondary/40 px-4 py-4 text-sm text-muted-foreground">
            Publish this workshop before creating cohorts.
          </div>
        ) : null}

        {isLoading ? (
          <FetchingState
            variant="section"
            label="Loading cohorts for this workshop."
          />
        ) : null}

        {!isLoading && error ? (
          <div className="space-y-4 rounded-lg border border-border bg-background px-4 py-6">
            <p className="text-sm text-muted-foreground">
              {error.response?.data?.errors?.[0]?.message ??
                "Unable to load cohorts right now."}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void refetch()}
            >
              Retry
            </Button>
          </div>
        ) : null}

        {!isLoading && !error && cohorts?.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background px-4 py-8 text-center">
            <p className="text-sm font-medium text-foreground">
              No cohorts yet
            </p>
          </div>
        ) : null}

        {!isLoading && !error && cohorts && cohorts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {cohorts.map((cohort) => (
              <Link
                key={cohort.id}
                to={getDetailPath(workshopId, cohort.id)}
                className="block"
              >
                <Card className="border-border/80 h-full shadow-none transition-colors hover:border-primary/40">
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CohortStatusBadge status={cohort.status} />
                      <span className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                        Starts {formatCalendarDate(cohort.startDate)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {formatCurrencyAmount(
                          cohort.spotPriceAmount,
                          cohort.currency,
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatCohortSeatLabel(cohort)}
                      </p>
                    </div>

                    <div className="grid gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span>
                          Ends{" "}
                          {formatCalendarDate(
                            cohort.lastSessionStartsAt.slice(0, 10),
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{cohort.activeSeats} active seats</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PencilLine className="h-4 w-4 text-primary" />
                        <span>
                          {cohort.heldSeats === 0
                            ? "Pricing and start date still editable"
                            : "Only capacity can change now"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

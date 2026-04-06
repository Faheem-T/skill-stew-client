import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CircleAlert,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { CohortStatusBadge } from "@/features/cohort/components/CohortStatusBadge";
import {
  formatCalendarDate,
  formatCohortSeatLabel,
  formatCurrencyAmount,
} from "@/features/cohort/lib/cohort";
import {
  getEnrollmentStatusLabel,
  getPublicEnrollmentState,
} from "@/features/cohort/lib/publicEnrollment";
import { usePublicWorkshopDetails } from "@/features/workshop/hooks/usePublicWorkshopDetails";
import { formatWorkshopStructure, sortWorkshopSessions } from "@/features/workshop/lib/workshop";
import { TopBar } from "@/shared/components/layout/TopBar";
import { AppNavbar } from "@/shared/components/layout/AppNavbar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { RoutePath } from "@/shared/config/routes";
import { useAppStore } from "@/app/store";
import useCurrentUserProfile from "@/shared/hooks/useCurrentUserProfile";

const getPublicCohortPath = (id: string) =>
  RoutePath.PublicCohortDetail.replace(":id", id);

const getEnrollmentSummary = (status: Parameters<
  typeof getPublicEnrollmentState
>[0]) => {
  const state = getPublicEnrollmentState(status);

  switch (state) {
    case "enrolled":
      return {
        title: "You have a seat in this workshop",
        body: "Your cohort is already set. Open the cohort page for the live schedule and enrollment details.",
      };
    case "payment_needed":
      return {
        title: "Payment is still pending",
        body: "Your seat is reserved for now. Open the cohort page to continue payment before the reservation expires.",
      };
    case "payment_issue":
      return {
        title: "Payment needs attention",
        body: "Your previous payment did not complete. Open the cohort page to try again while the cohort remains available.",
      };
    case "ended":
      return {
        title: "Your last enrollment is no longer active",
        body: "Open the cohort page to review the status and check whether you can enroll again.",
      };
    case "reconciliation":
      return {
        title: "Payment is being reconciled",
        body: "We are waiting for the final payment outcome. Open the cohort page to see the latest status.",
      };
  }
};

export const PublicWorkshopDetailPage = () => {
  const { id = "" } = useParams();
  const accessToken = useAppStore((state) => state.accessToken);
  const { data: currentUser } = useCurrentUserProfile({
    enabled: Boolean(accessToken),
  });
  const { data: workshop, isLoading, error } = usePublicWorkshopDetails(id);

  const shell = accessToken ? <AppNavbar /> : <TopBar />;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {shell}
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
          <div className="h-40 animate-pulse rounded-lg bg-muted" />
        </main>
      </div>
    );
  }

  if (!workshop || error) {
    return (
      <div className="min-h-screen bg-background">
        {shell}
        <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-10">
          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Workshop unavailable
              </CardTitle>
              <CardDescription className="leading-6">
                {error?.response?.data?.errors?.[0]?.message ??
                  "This workshop could not be loaded right now."}
              </CardDescription>
            </CardHeader>
            <CardContent className="border-t border-border/70 pt-6">
              <Button asChild>
                <Link to={RoutePath.Workshops}>Browse workshops</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const sortedSessions = sortWorkshopSessions(workshop.sessions);
  const topEnrollment = workshop.myEnrollment;
  const topEnrollmentSummary = topEnrollment
    ? getEnrollmentSummary(topEnrollment.status)
    : null;
  const canShowTopEnrollment =
    currentUser?.role === "USER" && topEnrollment && topEnrollmentSummary;

  return (
    <div className="min-h-screen bg-background">
      {shell}

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="overflow-hidden border-border/80 shadow-none">
            {workshop.bannerImageUrl ? (
              <img
                src={workshop.bannerImageUrl}
                alt={workshop.title}
                className="h-64 w-full object-cover"
              />
            ) : (
              <div className="flex h-64 items-center justify-center bg-secondary/50 text-sm text-muted-foreground">
                No banner uploaded
              </div>
            )}
            <CardContent className="space-y-4 pt-6">
              <Badge variant="secondary">Live workshop</Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {workshop.title}
                </h1>
                {workshop.description ? (
                  <p className="text-sm leading-6 text-muted-foreground md:text-base">
                    {workshop.description}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Workshop snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 border-t border-border/70 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>{sortedSessions.length} sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>{workshop.timezone || "Timezone not set"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{workshop.cohorts.length} upcoming cohorts</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {canShowTopEnrollment ? (
          <Card className="border-border/80 shadow-none">
            <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {getEnrollmentStatusLabel(topEnrollment.status)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-foreground">
                    {topEnrollmentSummary.title}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {topEnrollmentSummary.body}
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link to={getPublicCohortPath(topEnrollment.cohortId)}>
                  Open cohort
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Upcoming cohorts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 border-t border-border/70 pt-6">
              {workshop.cohorts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-background px-4 py-8 text-center">
                  <p className="text-sm font-medium text-foreground">
                    No upcoming cohorts available
                  </p>
                </div>
              ) : null}

              {workshop.cohorts.map((cohort) => {
                const seatNote =
                  cohort.heldSeats > cohort.activeSeats
                    ? "Availability includes live payment reservations."
                    : null;
                const exactEnrollment = cohort.myEnrollment;
                const isBlockedByAnotherCohort =
                  cohort.hasEnrollmentInAnotherCohort && !exactEnrollment;
                const linkState = {
                  workshopId: workshop.id,
                  enrolledCohortId: workshop.myEnrollment?.cohortId ?? null,
                };

                return (
                  <Card key={cohort.id} className="border-border/80 shadow-none">
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <CohortStatusBadge status={cohort.status} />
                          {exactEnrollment ? (
                            <Badge variant="secondary">
                              {getEnrollmentStatusLabel(exactEnrollment.status)}
                            </Badge>
                          ) : null}
                        </div>
                        <span className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                          Starts {formatCalendarDate(cohort.startDate)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {formatCurrencyAmount(
                            cohort.spotPriceAmount,
                            cohort.currency,
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCohortSeatLabel(cohort)}
                        </p>
                        {seatNote ? (
                          <p className="text-sm text-muted-foreground">
                            {seatNote}
                          </p>
                        ) : null}
                      </div>

                      <div className="grid gap-2 text-sm text-muted-foreground">
                        <p>
                          First live session:{" "}
                          {formatCalendarDate(
                            cohort.firstSessionStartsAt.slice(0, 10),
                          )}
                        </p>
                        <p>
                          Last live session:{" "}
                          {formatCalendarDate(
                            cohort.lastSessionStartsAt.slice(0, 10),
                          )}
                        </p>
                        {isBlockedByAnotherCohort ? (
                          <div className="flex items-start gap-2 rounded-lg border border-info/20 bg-info-muted px-4 py-3 text-foreground">
                            <CircleAlert className="mt-0.5 h-4 w-4 text-info" />
                            <p className="text-sm leading-6">
                              You already hold a live enrollment in another
                              cohort for this workshop.
                            </p>
                          </div>
                        ) : null}
                      </div>

                      <Button asChild variant="outline">
                        <Link to={getPublicCohortPath(cohort.id)} state={linkState}>
                          View cohort
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Session structure
              </CardTitle>
              <CardDescription className="leading-6">
                Cohort timing is finalized per run. This page shows the workshop
                blueprint.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 border-t border-border/70 pt-6">
              {sortedSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-lg border border-border bg-background px-4 py-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    {formatWorkshopStructure(
                      session.weekNumber,
                      session.dayOfWeek,
                      session.sessionOrder,
                    )}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {session.title || "Untitled session"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {session.startTime}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

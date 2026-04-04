import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CreditCard,
  LogIn,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { enrollInCohortRequest } from "@/features/cohort/api/cohorts";
import { CohortStatusBadge } from "@/features/cohort/components/CohortStatusBadge";
import {
  formatCalendarDate,
  formatCohortSeatLabel,
  formatCurrencyAmount,
  isPaidCohort,
} from "@/features/cohort/lib/cohort";
import { usePublishedWorkshopDetails } from "@/features/workshop/hooks/usePublishedWorkshopDetails";
import { PUBLISHED_WORKSHOP_DETAILS_QUERY_KEY } from "@/features/workshop/hooks/usePublishedWorkshopDetails";
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
import type { ApiErrorResponseType } from "@/shared/api/baseApi";
import type {
  PublicWorkshopCohortListItem,
  PublishedWorkshopDetails,
} from "@/features/workshop/types/types";

const isVisibleCohort = (status: PublicWorkshopCohortListItem["status"]) =>
  status === "upcoming" || status === "active";

export const PublicWorkshopDetailPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const accessToken = useAppStore((state) => state.accessToken);
  const { data: currentUser } = useCurrentUserProfile({
    enabled: Boolean(accessToken),
  });
  const { data: workshop, isLoading, error } = usePublishedWorkshopDetails(id);

  const visibleCohorts = useMemo(
    () => workshop?.cohorts.filter((cohort) => isVisibleCohort(cohort.status)) ?? [],
    [workshop?.cohorts],
  );

  const enrollmentMutation = useMutation({
    mutationFn: enrollInCohortRequest,
    onSuccess: (response, cohortId) => {
      queryClient.setQueryData<PublishedWorkshopDetails | undefined>(
        [PUBLISHED_WORKSHOP_DETAILS_QUERY_KEY, id],
        (currentWorkshop) => {
          if (!currentWorkshop) {
            return currentWorkshop;
          }

          return {
            ...currentWorkshop,
            cohorts: currentWorkshop.cohorts.map((cohort) => {
              if (cohort.id !== cohortId || cohort.currentUserEnrollment) {
                return cohort;
              }

              const shouldTakeSeat =
                response.data.status === "active" || response.data.requiresPayment;

              return {
                ...cohort,
                currentUserEnrollment: response.data,
                activeSeats:
                  response.data.status === "active"
                    ? cohort.activeSeats + 1
                    : cohort.activeSeats,
                heldSeats: shouldTakeSeat ? cohort.heldSeats + 1 : cohort.heldSeats,
                availableSeats: shouldTakeSeat
                  ? Math.max(cohort.availableSeats - 1, 0)
                  : cohort.availableSeats,
              };
            }),
          };
        },
      );

      toast.success(
        response.data.requiresPayment
          ? "Seat reserved. Payment support is coming soon."
          : "You are enrolled in this cohort.",
      );
    },
    onError: (caughtError) => {
      const errorResponse = caughtError as ApiErrorResponseType;
      toast.error(
        errorResponse.response?.data?.errors?.[0]?.message ??
          "Unable to enroll in this cohort.",
      );
    },
  });

  const handleEnroll = (cohort: PublicWorkshopCohortListItem) => {
    if (!accessToken) {
      navigate(
        `${RoutePath.Login}?redirect=${encodeURIComponent(
          location.pathname + location.search,
        )}`,
      );
      return;
    }

    if (currentUser?.role !== "USER") {
      return;
    }

    if (isPaidCohort(cohort)) {
      return;
    }

    enrollmentMutation.mutate(cohort.id);
  };

  const shell = accessToken ? <AppNavbar /> : <TopBar />;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {shell}
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
          <div className="h-40 animate-pulse rounded bg-muted" />
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
                <Link to={RoutePath.Home}>Return home</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const sortedSessions = sortWorkshopSessions(workshop.sessions);

  return (
    <div className="min-h-screen bg-background">
      {shell}

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="border-border/80 overflow-hidden shadow-none">
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
              <Badge
                variant="secondary"
                className="w-fit rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]"
              >
                Live workshop
              </Badge>
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

          <Card className="border-border/80 h-fit shadow-none">
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
                <span>{visibleCohorts.length} visible cohorts</span>
              </div>
              {workshop.expertName ? <p>Led by {workshop.expertName}</p> : null}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Available cohorts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 border-t border-border/70 pt-6">
              {visibleCohorts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-background px-4 py-8 text-center">
                  <p className="text-sm font-medium text-foreground">
                    No upcoming cohorts available
                  </p>
                </div>
              ) : null}

              {visibleCohorts.map((cohort) => {
                const isPaid = isPaidCohort(cohort);
                const enrollment = cohort.currentUserEnrollment;
                const isUser = currentUser?.role === "USER";
                const isGuest = !accessToken;
                const isCurrentMutation =
                  enrollmentMutation.isPending &&
                  enrollmentMutation.variables === cohort.id;

                const action = enrollment
                  ? {
                      label:
                        enrollment.status === "active"
                          ? "Enrolled"
                          : enrollment.requiresPayment
                            ? "Payment pending"
                            : enrollment.status,
                      disabled: true,
                      icon: enrollment.requiresPayment ? CreditCard : Users,
                    }
                  : isPaid
                    ? {
                        label: "Payment coming soon",
                        disabled: true,
                        icon: CreditCard,
                      }
                    : isGuest
                      ? {
                          label: "Log in to enroll",
                          disabled: false,
                          icon: LogIn,
                        }
                      : !isUser
                        ? {
                            label: "Learner accounts only",
                            disabled: true,
                            icon: Users,
                          }
                        : {
                            label: isCurrentMutation ? "Enrolling..." : "Enroll for free",
                            disabled: isCurrentMutation,
                            icon: ArrowRight,
                          };

                const ActionIcon = action.icon;

                return (
                  <Card key={cohort.id} className="border-border/80 shadow-none">
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <CohortStatusBadge status={cohort.status} />
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
                      </div>

                      <div className="grid gap-2 text-sm text-muted-foreground">
                        <p>
                          First live session:{" "}
                          {formatCalendarDate(cohort.firstSessionStartsAt.slice(0, 10))}
                        </p>
                        <p>
                          Last live session:{" "}
                          {formatCalendarDate(cohort.lastSessionStartsAt.slice(0, 10))}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant={action.disabled ? "outline" : "default"}
                        disabled={action.disabled}
                        onClick={() => handleEnroll(cohort)}
                      >
                        <ActionIcon className="h-4 w-4" />
                        {action.label}
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
                Cohort dates are derived by the backend per run. This outline
                shows the workshop blueprint only.
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

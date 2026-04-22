import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CircleAlert,
  CreditCard,
  RefreshCw,
  Loader2,
  LogIn,
  Users,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import toast from "react-hot-toast";
import { useAppStore } from "@/app/store";
import { enrollInCohortRequest } from "@/features/cohort/api/cohorts";
import { CohortStatusBadge } from "@/features/cohort/components/CohortStatusBadge";
import { usePublicCohortDetails } from "@/features/cohort/hooks/usePublicCohortDetails";
import { PUBLIC_COHORT_DETAILS_QUERY_KEY } from "@/features/cohort/hooks/usePublicCohortDetails";
import {
  formatCalendarDate,
  formatCohortSeatLabel,
  formatDateTime,
  getCohortSessionLabel,
} from "@/features/cohort/lib/cohort";
import { formatCurrencyAmount } from "../lib/currency";
import {
  getEnrollmentStatusLabel,
  getPublicEnrollmentState,
} from "@/features/cohort/lib/publicEnrollment";
import {
  getPaymentReturnPanelCopy,
  isStableEnrollmentStatus,
  parseStripeCheckoutReturnParams,
  STRIPE_RETURN_POLL_INTERVAL_MS,
  STRIPE_RETURN_POLL_TIMEOUT_MS,
  STRIPE_RETURN_QUERY_PARAM_KEYS,
} from "@/features/cohort/lib/paymentReturn";
import { PUBLIC_WORKSHOP_DETAILS_QUERY_KEY } from "@/features/workshop/hooks/usePublicWorkshopDetails";
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
import useCurrentUserProfile from "@/shared/hooks/useCurrentUserProfile";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";
import type { CohortEnrollmentStatus } from "@/features/cohort/types/types";

const getPublicWorkshopPath = (id: string) =>
  RoutePath.PublicWorkshopDetail.replace(":id", id);

const getPublicCohortPath = (id: string) =>
  RoutePath.PublicCohortDetail.replace(":id", id);

const getStatusPanelCopy = (status: CohortEnrollmentStatus) => {
  const state = getPublicEnrollmentState(status);

  switch (state) {
    case "enrolled":
      return {
        title: "You are enrolled in this cohort",
        body: "Your seat is confirmed. Check the session schedule below for the full run.",
        tone: "default" as const,
      };
    case "payment_needed":
      return {
        title: "Your seat is reserved",
        body: "Payment still needs to be completed before the reservation expires.",
        tone: "warning" as const,
      };
    case "payment_issue":
      return {
        title: "Payment needs attention",
        body: "The last payment attempt did not complete. Try again while the cohort is still available.",
        tone: "warning" as const,
      };
    case "ended":
      return {
        title: "Your previous enrollment is no longer active",
        body: "You can enroll again only if the cohort is still open.",
        tone: "secondary" as const,
      };
    case "reconciliation":
      return {
        title: "Payment is being reconciled",
        body: "We are waiting for the final payment outcome. Enrollment is temporarily unavailable.",
        tone: "info" as const,
      };
  }
};

type PublicCohortLocationState = {
  workshopId?: string;
  enrolledCohortId?: string | null;
};

export const PublicCohortDetailPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigationState =
    (location.state as PublicCohortLocationState | null) ?? null;
  const queryClient = useQueryClient();
  const accessToken = useAppStore((state) => state.accessToken);
  const [isPaymentReturnPolling, setIsPaymentReturnPolling] = useState(false);
  const { data: currentUser } = useCurrentUserProfile({
    enabled: Boolean(accessToken),
  });
  const {
    data: cohort,
    isLoading,
    error,
    refetch: refetchCohort,
  } = usePublicCohortDetails(id);
  const paymentReturn = useMemo(
    () => parseStripeCheckoutReturnParams(searchParams, id),
    [id, searchParams],
  );

  const mutation = useMutation({
    mutationFn: enrollInCohortRequest,
    onSuccess: async (response) => {
      if (response.data.requiresPayment && response.data.checkoutUrl) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [PUBLIC_COHORT_DETAILS_QUERY_KEY, id],
          }),
          queryClient.invalidateQueries({
            queryKey: [PUBLIC_WORKSHOP_DETAILS_QUERY_KEY],
          }),
        ]);
        window.location.assign(response.data.checkoutUrl);
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [PUBLIC_COHORT_DETAILS_QUERY_KEY, id],
        }),
        queryClient.invalidateQueries({
          queryKey: [PUBLIC_WORKSHOP_DETAILS_QUERY_KEY],
        }),
      ]);

      toast.success("You are enrolled in this cohort.");
    },
    onError: (caughtError) => {
      const errorResponse = caughtError as ApiErrorResponseType;
      toast.error(
        errorResponse.response?.data?.errors?.[0]?.message ??
          "Unable to continue enrollment right now.",
      );
    },
  });

  useEffect(() => {
    if (!paymentReturn || !id) {
      setIsPaymentReturnPolling(false);
      return;
    }

    let isDisposed = false;
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    const clearPaymentReturnParams = () => {
      const nextSearchParams = new URLSearchParams(searchParams);
      let changed = false;

      STRIPE_RETURN_QUERY_PARAM_KEYS.forEach((key) => {
        if (nextSearchParams.has(key)) {
          nextSearchParams.delete(key);
          changed = true;
        }
      });

      if (!changed) {
        return;
      }

      const nextSearch = nextSearchParams.toString();

      navigate(
        {
          pathname: location.pathname,
          search: nextSearch ? `?${nextSearch}` : "",
        },
        { replace: true, state: navigationState },
      );
    };

    const invalidateRelatedQueries = async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [PUBLIC_COHORT_DETAILS_QUERY_KEY, id],
        }),
        paymentReturn.workshopId
          ? queryClient.invalidateQueries({
              queryKey: [
                PUBLIC_WORKSHOP_DETAILS_QUERY_KEY,
                paymentReturn.workshopId,
              ],
            })
          : Promise.resolve(),
      ]);
    };

    const startPolling = async () => {
      setIsPaymentReturnPolling(true);
      await invalidateRelatedQueries();

      const initialResult = await refetchCohort();

      if (isDisposed) {
        return;
      }

      if (isStableEnrollmentStatus(initialResult.data?.myEnrollment?.status)) {
        setIsPaymentReturnPolling(false);
        clearPaymentReturnParams();
        return;
      }

      intervalId = window.setInterval(async () => {
        const nextResult = await refetchCohort();

        if (isDisposed) {
          return;
        }

        if (isStableEnrollmentStatus(nextResult.data?.myEnrollment?.status)) {
          setIsPaymentReturnPolling(false);
          clearPaymentReturnParams();
        }
      }, STRIPE_RETURN_POLL_INTERVAL_MS);

      timeoutId = window.setTimeout(() => {
        if (isDisposed) {
          return;
        }

        setIsPaymentReturnPolling(false);
        clearPaymentReturnParams();
      }, STRIPE_RETURN_POLL_TIMEOUT_MS);
    };

    void startPolling();

    return () => {
      isDisposed = true;
      setIsPaymentReturnPolling(false);

      if (intervalId) {
        window.clearInterval(intervalId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [
    id,
    location.pathname,
    navigate,
    navigationState,
    paymentReturn,
    queryClient,
    refetchCohort,
    searchParams,
  ]);

  const shell = accessToken ? <AppNavbar /> : <TopBar />;

  const handleEnroll = () => {
    if (!cohort) {
      return;
    }

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

    mutation.mutate(cohort.id);
  };

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

  if (!cohort || error) {
    const fallbackWorkshopId = navigationState?.workshopId;
    const fallbackHref = fallbackWorkshopId
      ? getPublicWorkshopPath(fallbackWorkshopId)
      : RoutePath.Workshops;

    return (
      <div className="min-h-screen bg-background">
        {shell}
        <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-10">
          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Cohort unavailable
              </CardTitle>
              <CardDescription className="leading-6">
                {error?.response?.data?.errors?.[0]?.message ??
                  "This cohort is no longer publicly available."}
              </CardDescription>
            </CardHeader>
            <CardContent className="border-t border-border/70 pt-6">
              <Button asChild>
                <Link to={fallbackHref}>
                  {fallbackWorkshopId ? "Back to workshop" : "Browse workshops"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const exactEnrollment = cohort.myEnrollment;
  const enrollmentState = exactEnrollment
    ? getPublicEnrollmentState(exactEnrollment.status)
    : null;
  const statusPanel = exactEnrollment
    ? getStatusPanelCopy(exactEnrollment.status)
    : null;
  const paymentReturnPanel = paymentReturn
    ? getPaymentReturnPanelCopy({
        paymentReturn,
        enrollmentStatus: exactEnrollment?.status,
        isPolling: isPaymentReturnPolling,
      })
    : null;
  const isBlockedByAnotherCohort =
    cohort.hasEnrollmentInAnotherCohort && !exactEnrollment;
  const enrolledCohortId =
    navigationState?.enrolledCohortId &&
    navigationState.enrolledCohortId !== cohort.id
      ? navigationState.enrolledCohortId
      : null;
  const isUser = currentUser?.role === "USER";
  const canResumePayment = enrollmentState === "payment_needed";
  const canRetryPayment = enrollmentState === "payment_issue";
  const canRetryEndedEnrollment =
    enrollmentState === "ended" && cohort.isEnrollable;
  const canStartEnrollment =
    !exactEnrollment && cohort.isEnrollable && !isBlockedByAnotherCohort;
  const canSubmitEnrollment =
    isUser &&
    (canStartEnrollment ||
      canResumePayment ||
      canRetryPayment ||
      canRetryEndedEnrollment);

  let cta: {
    label: string;
    icon: typeof ArrowRight;
    disabled?: boolean;
    onClick?: () => void;
    href?: string;
  } | null = null;

  if (!accessToken) {
    cta = {
      label: "Log in to enroll",
      icon: LogIn,
      onClick: handleEnroll,
    };
  } else if (isBlockedByAnotherCohort && enrolledCohortId) {
    cta = {
      label: "Open your cohort",
      icon: ArrowRight,
      href: getPublicCohortPath(enrolledCohortId),
    };
  } else if (currentUser?.role === "USER" && canSubmitEnrollment) {
    cta = {
      label: mutation.isPending
        ? "Opening checkout..."
        : canResumePayment
          ? "Continue payment"
          : canRetryPayment
            ? "Try payment again"
            : canRetryEndedEnrollment
              ? "Enroll again"
              : cohort.spotPriceAmount > 0
                ? "Reserve seat"
                : "Enroll now",
      icon:
        canResumePayment || canRetryPayment || cohort.spotPriceAmount > 0
          ? CreditCard
          : ArrowRight,
      disabled: mutation.isPending,
      onClick: handleEnroll,
    };
  }

  return (
    <div className="min-h-screen bg-background">
      {shell}

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="overflow-hidden border-border/80 shadow-none">
            {cohort.workshopBannerImageUrl ? (
              <img
                src={cohort.workshopBannerImageUrl}
                alt={cohort.workshopTitle}
                className="h-64 w-full object-cover"
              />
            ) : (
              <div className="flex h-64 items-center justify-center bg-secondary/50 text-sm text-muted-foreground">
                No banner uploaded
              </div>
            )}
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-wrap items-center gap-2">
                <CohortStatusBadge status={cohort.status} />
                {exactEnrollment ? (
                  <Badge variant="secondary">
                    {getEnrollmentStatusLabel(exactEnrollment.status)}
                  </Badge>
                ) : null}
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {cohort.workshopTitle}
                </h1>
                <p className="text-sm leading-6 text-muted-foreground md:text-base">
                  Starts {formatCalendarDate(cohort.startDate)} in{" "}
                  {cohort.workshopTimezone}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Cohort snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 border-t border-border/70 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-2xl font-semibold">
                  {formatCurrencyAmount(
                    cohort.spotPriceAmount,
                    cohort.currency,
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{formatCohortSeatLabel(cohort)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>{formatDateTime(cohort.firstSessionStartsAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>{cohort.sessions.length} scheduled sessions</span>
              </div>
              {cta?.href && cta ? (
                <Button asChild className="w-full">
                  <Link to={cta.href}>
                    <cta.icon className="h-4 w-4" />
                    {cta.label}
                  </Link>
                </Button>
              ) : null}
              {cta?.onClick && cta ? (
                <Button
                  type="button"
                  className="w-full"
                  disabled={cta.disabled}
                  onClick={cta.onClick}
                >
                  {mutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <cta.icon className="h-4 w-4" />
                  )}
                  {cta.label}
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </section>

        {statusPanel ? (
          <div
            className={
              statusPanel.tone === "warning"
                ? "rounded-lg border border-warning/20 bg-warning-muted px-4 py-4"
                : statusPanel.tone === "info"
                  ? "rounded-lg border border-info/20 bg-info-muted px-4 py-4"
                  : "rounded-lg border border-border bg-card px-4 py-4"
            }
          >
            <p className="text-sm font-medium text-foreground">
              {statusPanel.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {statusPanel.body}
            </p>
          </div>
        ) : null}

        {paymentReturnPanel ? (
          <div
            className={
              paymentReturnPanel.tone === "success"
                ? "rounded-lg border border-success/20 bg-success-muted px-4 py-4"
                : paymentReturnPanel.tone === "warning"
                  ? "rounded-lg border border-warning/20 bg-warning-muted px-4 py-4"
                  : "rounded-lg border border-info/20 bg-info-muted px-4 py-4"
            }
          >
            <div className="flex items-start gap-3">
              {isPaymentReturnPolling ? (
                <RefreshCw className="mt-0.5 h-4 w-4 animate-spin text-info" />
              ) : (
                <CircleAlert
                  className={
                    paymentReturnPanel.tone === "success"
                      ? "mt-0.5 h-4 w-4 text-success"
                      : paymentReturnPanel.tone === "warning"
                        ? "mt-0.5 h-4 w-4 text-warning"
                        : "mt-0.5 h-4 w-4 text-info"
                  }
                />
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {paymentReturnPanel.title}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {paymentReturnPanel.body}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {isBlockedByAnotherCohort ? (
          <div className="rounded-lg border border-info/20 bg-info-muted px-4 py-4">
            <div className="flex items-start gap-3">
              <CircleAlert className="mt-0.5 h-4 w-4 text-info" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  You already hold a live enrollment in another cohort
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Only one live enrollment per workshop is allowed at a time.
                </p>
                {enrolledCohortId ? (
                  <Button asChild variant="outline">
                    <Link to={getPublicCohortPath(enrolledCohortId)}>
                      Open your cohort
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {!accessToken ? null : currentUser?.role !== "USER" ? (
          <div className="rounded-lg border border-border bg-card px-4 py-4">
            <p className="text-sm font-medium text-foreground">
              Enrollment is available to learner accounts only.
            </p>
          </div>
        ) : null}

        {!cohort.isEnrollable &&
        !exactEnrollment &&
        !isBlockedByAnotherCohort ? (
          <div className="rounded-lg border border-border bg-card px-4 py-4">
            <p className="text-sm font-medium text-foreground">
              Enrollment is closed for this cohort.
            </p>
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Session schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 border-t border-border/70 pt-6">
              {cohort.sessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-lg border border-border bg-background px-4 py-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    {getCohortSessionLabel(session)}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {session.title || "Untitled session"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDateTime(session.startsAt)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Cohort details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 border-t border-border/70 pt-6">
              <DetailRow
                label="Workshop"
                value={cohort.workshopTitle}
                href={getPublicWorkshopPath(cohort.workshopId)}
              />
              <DetailRow
                label="First session"
                value={formatDateTime(cohort.firstSessionStartsAt)}
              />
              <DetailRow
                label="Last session"
                value={formatDateTime(cohort.lastSessionStartsAt)}
              />
              <DetailRow label="Timezone" value={cohort.workshopTimezone} />
              <DetailRow
                label="Active seats"
                value={String(cohort.activeSeats)}
              />
              <DetailRow label="Held seats" value={String(cohort.heldSeats)} />
              <DetailRow
                label="Available seats"
                value={String(cohort.availableSeats)}
              />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

const DetailRow = ({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      {href ? (
        <Link
          to={href}
          className="text-right text-sm font-medium text-foreground"
        >
          {value}
        </Link>
      ) : (
        <span className="text-right text-sm font-medium text-foreground">
          {value}
        </span>
      )}
    </div>
  );
};

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit3,
  Loader2,
  Users,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { AppNavbar } from "@/shared/components/layout/AppNavbar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { publishWorkshopRequest } from "@/features/workshop/api/publishWorkshop";
import {
  useExpertWorkshopDetails,
  EXPERT_WORKSHOP_DETAILS_QUERY_KEY,
} from "@/features/workshop/hooks/useExpertWorkshopDetails";
import { EXPERT_WORKSHOPS_QUERY_KEY } from "@/features/workshop/hooks/useExpertWorkshops";
import {
  formatWorkshopStructure,
  getApiErrorItems,
  getGeneralErrorMessage,
  getPublishSection,
  sortWorkshopSessions,
} from "@/features/workshop/lib/workshop";
import type { ApiErrorItem } from "@/features/workshop/types/types";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";
import { RoutePath } from "@/shared/config/routes";
import { InlineStatus } from "@/features/workshop/components/WorkshopWizardShared";
import { WorkshopUnavailablePanel } from "@/features/workshop/components/WorkshopStatusPanels";
import type { ReviewErrorGroup } from "@/features/workshop/lib/wizard";
import { useExpertCohorts } from "@/features/cohort/hooks/useExpertCohorts";
import { ExpertWorkshopCohortSection } from "@/features/cohort/components/ExpertWorkshopCohortSection";

const getEditPath = (id: string) =>
  RoutePath.ExpertWorkshopEdit.replace(":id", id);

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const ExpertWorkshopDetailPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: workshop, isLoading, error } = useExpertWorkshopDetails(id);
  const { data: cohorts } = useExpertCohorts({ workshopId: id });
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [publishErrors, setPublishErrors] = useState<ReviewErrorGroup[]>([]);

  const publishMutation = useMutation({
    mutationFn: publishWorkshopRequest,
  });

  const unavailableStatus = useMemo(() => {
    if (!error) {
      return null;
    }

    const status = error.response?.status;
    const message = getGeneralErrorMessage(
      error,
      "Unable to load this workshop right now.",
    );

    if (status === 403) {
      return { kind: "forbidden", message } as const;
    }

    if (status === 404) {
      return { kind: "missing", message } as const;
    }

    if (status === 409) {
      return { kind: "locked", message } as const;
    }

    return { kind: "missing", message } as const;
  }, [error]);

  const handlePublish = async () => {
    if (!workshop) {
      return;
    }

    setPublishMessage(null);
    setPublishErrors([]);

    try {
      const response = await publishMutation.mutateAsync(workshop.id);
      queryClient.setQueryData(
        [EXPERT_WORKSHOP_DETAILS_QUERY_KEY, workshop.id],
        response.data,
      );
      await queryClient.invalidateQueries({
        queryKey: [EXPERT_WORKSHOPS_QUERY_KEY],
      });
      navigate(RoutePath.ExpertWorkshops, { replace: true });
    } catch (caughtError) {
      if (!(caughtError instanceof AxiosError)) {
        setPublishMessage("Unable to publish the workshop right now.");
        return;
      }

      const apiError = caughtError as ApiErrorResponseType;
      const status = apiError.response?.status;
      const items = getApiErrorItems(apiError);

      if (status === 422) {
        const grouped = items.reduce<
          Record<ReviewErrorGroup["section"], ApiErrorItem[]>
        >(
          (acc, item) => {
            const section = getPublishSection(
              item.field,
            ) as ReviewErrorGroup["section"];
            acc[section].push(item);
            return acc;
          },
          {
            basics: [],
            schedule: [],
            sessions: [],
            review: [],
          },
        );

        setPublishErrors(
          Object.entries(grouped)
            .filter(([, sectionItems]) => sectionItems.length > 0)
            .map(([section, sectionItems]) => ({
              section: section as ReviewErrorGroup["section"],
              items: sectionItems,
            })),
        );
        setPublishMessage(
          "Publishing is blocked until the missing details below are resolved.",
        );
        return;
      }

      setPublishMessage(
        getGeneralErrorMessage(
          apiError,
          "Unable to publish the workshop right now.",
        ),
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (unavailableStatus) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
          <WorkshopUnavailablePanel status={unavailableStatus} />
        </main>
      </div>
    );
  }

  if (!workshop) {
    return null;
  }

  const sortedSessions = sortWorkshopSessions(workshop.sessions);
  const isDraft = workshop.status === "draft";
  const hasCohorts = (cohorts?.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" asChild>
            <Link to={RoutePath.ExpertWorkshops}>
              <ArrowLeft className="h-4 w-4" />
              Back to workshops
            </Link>
          </Button>
        </div>

        <section
          className={
            isDraft || hasCohorts
              ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"
              : "grid gap-6"
          }
        >
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
                className="rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]"
              >
                {workshop.status}
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  {workshop.title}
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                  {workshop.description || "No description added yet."}
                </p>
              </div>
            </CardContent>
          </Card>

          {isDraft && !hasCohorts && (
            <Card className="border-border/80 h-fit shadow-none">
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Workshop actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 border-t border-border/70 pt-6">
                <Button asChild className="w-full">
                  <Link to={getEditPath(workshop.id)}>
                    <Edit3 className="h-4 w-4" />
                    Edit workshop
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => void handlePublish()}
                  disabled={publishMutation.isPending}
                >
                  {publishMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Publish workshop
                </Button>
              </CardContent>
            </Card>
          )}

          {hasCohorts ? (
            <Card className="border-warning/20 h-fit bg-warning-muted shadow-none">
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Workshop frozen by cohorts
                </CardTitle>
              </CardHeader>
            </Card>
          ) : null}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <DetailMetric
            icon={<Users className="h-4 w-4 text-primary" />}
            label="Max cohort size"
            value={String(workshop.maxCohortSize)}
          />
          <DetailMetric
            icon={<Clock3 className="h-4 w-4 text-primary" />}
            label="Timezone"
            value={workshop.timezone || "Not set"}
          />
          <DetailMetric
            icon={<CalendarDays className="h-4 w-4 text-primary" />}
            label="Sessions"
            value={String(workshop.sessions.length)}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Workshop details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 border-t border-border/70 pt-6">
              <DetailRow
                label="Target audience"
                value={workshop.targetAudience || "Not provided"}
              />
              <DetailRow
                label="Created"
                value={formatDateTime(workshop.createdAt)}
              />
              <DetailRow
                label="Updated"
                value={formatDateTime(workshop.updatedAt)}
              />
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Session plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 border-t border-border/70 pt-6">
              {sortedSessions.length === 0 ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  No sessions saved yet.
                </p>
              ) : (
                sortedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-lg border border-border bg-background px-4 py-4"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                      {formatWorkshopStructure(
                        session.weekNumber,
                        session.dayOfWeek,
                        session.sessionOrder,
                      )}
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
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {session.description ||
                        "No session description provided."}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <ExpertWorkshopCohortSection
          workshopId={workshop.id}
          workshopStatus={workshop.status}
        />

        {publishMessage && (
          <InlineStatus
            variant={publishErrors.length > 0 ? "error" : "default"}
            icon={
              publishErrors.length > 0 ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )
            }
            title={
              publishErrors.length > 0 ? "Publishing blocked" : "Publish status"
            }
          >
            {publishMessage}
          </InlineStatus>
        )}

        {publishErrors.length > 0 && (
          <div className="space-y-4">
            {publishErrors.map((group) => (
              <Card
                key={group.section}
                className="border-destructive/30 shadow-none"
              >
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {group.section === "basics"
                      ? "Basics"
                      : group.section === "schedule"
                        ? "Schedule"
                        : group.section === "sessions"
                          ? "Session details"
                          : "Review"}
                  </CardTitle>
                  <CardDescription className="leading-6">
                    Resolve these issues, then publish again.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 border-t border-border/70 pt-6">
                  <ul className="space-y-2 text-sm text-destructive">
                    {group.items.map((item) => (
                      <li
                        key={`${group.section}-${item.field}-${item.message}`}
                      >
                        {item.message}
                      </li>
                    ))}
                  </ul>
                  {isDraft && !hasCohorts && (
                    <Button asChild variant="outline">
                      <Link to={getEditPath(workshop.id)}>Edit workshop</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const DetailMetric = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </p>
          <CardTitle className="text-2xl font-semibold text-foreground">
            {value}
          </CardTitle>
        </div>
        <div className="rounded-sm border border-border/80 bg-secondary/50 p-2">
          {icon}
        </div>
      </CardHeader>
    </Card>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
};

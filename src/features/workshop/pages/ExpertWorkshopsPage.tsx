import { useMemo } from "react";
import { Calendar, Clock3, FolderOpen, Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router";
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
import { useExpertWorkshops } from "@/features/workshop/hooks/useExpertWorkshops";
import type {
  WorkshopListItem,
  WorkshopStatus,
} from "@/features/workshop/types/types";
import { RoutePath } from "@/shared/config/routes";

const STATUS_OPTIONS: Array<{ value: WorkshopStatus; label: string }> = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const getWorkshopDetailPath = (id: string) =>
  RoutePath.ExpertWorkshopDetail.replace(":id", id);

const formatUpdatedAt = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const ExpertWorkshopsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = useMemo<WorkshopStatus>(() => {
    const rawStatus = searchParams.get("status");

    if (
      rawStatus === "draft" ||
      rawStatus === "published" ||
      rawStatus === "archived"
    ) {
      return rawStatus;
    }

    return "published";
  }, [searchParams]);

  const { data: workshops, isLoading, error, refetch } =
    useExpertWorkshops(currentStatus);

  const updateStatus = (status: WorkshopStatus) => {
    setSearchParams(status === "published" ? {} : { status });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge
              variant="secondary"
              className="w-fit rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]"
            >
              Expert workshops
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Manage your workshops
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                Review published cohorts, continue drafts, and inspect archived
                workshops from one place.
              </p>
            </div>
          </div>

          <Button asChild>
            <Link to={RoutePath.ExpertWorkshopCreate}>
              <Plus className="h-4 w-4" />
              Create workshop
            </Link>
          </Button>
        </section>

        <section className="flex flex-wrap gap-3">
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={currentStatus === option.value ? "default" : "outline"}
              onClick={() => updateStatus(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </section>

        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border-border/80 shadow-none">
                <div className="h-44 animate-pulse rounded-t-lg bg-muted" />
                <CardContent className="space-y-4 pt-6">
                  <div className="h-5 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="grid gap-2">
                    <div className="h-4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Unable to load workshops
              </CardTitle>
              <CardDescription className="leading-6">
                {error.response?.data?.errors?.[0]?.message ??
                  "Something went wrong while loading your workshops."}
              </CardDescription>
            </CardHeader>
            <CardContent className="border-t border-border/70 pt-6">
              <Button type="button" onClick={() => void refetch()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && workshops && workshops.length === 0 && (
          <EmptyWorkshopsState status={currentStatus} />
        )}

        {!isLoading && !error && workshops && workshops.length > 0 && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workshops.map((workshop) => (
              <WorkshopListCard key={workshop.id} workshop={workshop} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

const WorkshopListCard = ({ workshop }: { workshop: WorkshopListItem }) => {
  return (
    <Link to={getWorkshopDetailPath(workshop.id)} className="block">
      <Card className="border-border/80 h-full overflow-hidden shadow-none transition-colors hover:border-primary/40">
        {workshop.bannerImageUrl ? (
          <img
            src={workshop.bannerImageUrl}
            alt={workshop.title}
            className="h-44 w-full object-cover"
          />
        ) : (
          <div className="flex h-44 items-center justify-center bg-secondary/50 text-sm text-muted-foreground">
            No banner uploaded
          </div>
        )}

        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className="rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]"
            >
              {workshop.status}
            </Badge>
            <h2 className="text-xl font-semibold text-foreground">
              {workshop.title}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {workshop.description || "No description added yet."}
            </p>
          </div>

          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{workshop.sessionCount} sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-primary" />
              <span>{workshop.timezone || "Timezone not set"}</span>
            </div>
            <div className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Updated {formatUpdatedAt(workshop.updatedAt)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const EmptyWorkshopsState = ({ status }: { status: WorkshopStatus }) => {
  const copy =
    status === "published"
      ? {
          title: "No published workshops yet",
          description:
            "Your published workshops will appear here once you complete and publish a draft.",
        }
      : status === "draft"
        ? {
            title: "No draft workshops yet",
            description:
              "Start a new draft workshop to begin building your next live cohort.",
          }
        : {
            title: "No archived workshops",
            description:
              "Archived workshops will show up here after they are moved out of active circulation.",
          };

  return (
    <Card className="border-border/80 shadow-none">
      <CardContent className="flex flex-col items-start gap-4 py-10">
        <div className="rounded-full border border-border bg-secondary/60 p-3">
          <FolderOpen className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">{copy.title}</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {copy.description}
          </p>
        </div>
        <Button asChild>
          <Link to={RoutePath.ExpertWorkshopCreate}>Create workshop</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

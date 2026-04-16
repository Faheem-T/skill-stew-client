import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, PencilLine, Trash2, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { deleteCohortRequest } from "@/features/cohort/api/cohorts";
import { CohortSessionList } from "@/features/cohort/components/CohortSessionList";
import { CohortStatusBadge } from "@/features/cohort/components/CohortStatusBadge";
import { useExpertCohortDetails } from "@/features/cohort/hooks/useExpertCohortDetails";
import { EXPERT_COHORTS_QUERY_KEY } from "@/features/cohort/hooks/useExpertCohorts";
import {
  canDeleteCohort,
  canEditCohortPricing,
  formatCalendarDate,
  formatCohortSeatLabel,
  formatDateTime,
} from "@/features/cohort/lib/cohort";
import { formatCurrencyAmount } from "../lib/currency";
import { AppNavbar } from "@/shared/components/layout/AppNavbar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { RoutePath } from "@/shared/config/routes";
import { EXPERT_WORKSHOP_DETAILS_QUERY_KEY } from "@/features/workshop/hooks/useExpertWorkshopDetails";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";

const getWorkshopPath = (workshopId: string) =>
  RoutePath.ExpertWorkshopDetail.replace(":id", workshopId);

const getEditPath = (workshopId: string, cohortId: string) =>
  RoutePath.ExpertWorkshopCohortEdit.replace(":workshopId", workshopId).replace(
    ":cohortId",
    cohortId,
  );

const getMembersPath = (workshopId: string, cohortId: string) =>
  RoutePath.ExpertWorkshopCohortMembers.replace(
    ":workshopId",
    workshopId,
  ).replace(":cohortId", cohortId);

export const ExpertCohortDetailPage = () => {
  const { workshopId = "", cohortId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: cohort, isLoading, error } = useExpertCohortDetails(cohortId);

  const deleteMutation = useMutation({
    mutationFn: deleteCohortRequest,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [EXPERT_COHORTS_QUERY_KEY],
      });
      await queryClient.invalidateQueries({
        queryKey: [EXPERT_WORKSHOP_DETAILS_QUERY_KEY, workshopId],
      });
      toast.success(response.message || "Cohort deleted.");
      navigate(getWorkshopPath(workshopId), { replace: true });
    },
    onError: (caughtError) => {
      const errorResponse = caughtError as ApiErrorResponseType;
      toast.error(
        errorResponse.response?.data?.errors?.[0]?.message ??
          "Unable to delete this cohort.",
      );
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
          <div className="h-10 animate-pulse rounded bg-muted" />
        </main>
      </div>
    );
  }

  if (!cohort || error) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-10">
          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Unable to load cohort
              </CardTitle>
              <CardDescription className="leading-6">
                {error?.response?.data?.errors?.[0]?.message ??
                  "This cohort is unavailable."}
              </CardDescription>
            </CardHeader>
            <CardContent className="border-t border-border/70 pt-6">
              <Button asChild>
                <Link to={getWorkshopPath(workshopId)}>Back to workshop</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const canEditPricingFields = canEditCohortPricing(cohort);
  const canDelete = canDeleteCohort(cohort);

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" asChild>
            <Link to={getWorkshopPath(workshopId)}>
              <ArrowLeft className="h-4 w-4" />
              Back to workshop
            </Link>
          </Button>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <Card className="border-border/80 shadow-none">
            <CardContent className="space-y-5 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CohortStatusBadge status={cohort.status} />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  {cohort.workshopTitle}
                </h1>
                <p className="text-sm leading-6 text-muted-foreground md:text-base">
                  Starts {formatCalendarDate(cohort.startDate)} •{" "}
                  {formatCurrencyAmount(
                    cohort.spotPriceAmount,
                    cohort.currency,
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 h-fit shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg font-semibold text-foreground">
                Cohort actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 border-t border-border/70 pt-6">
              <Button asChild className="w-full">
                <Link to={getEditPath(workshopId, cohort.id)}>
                  <PencilLine className="h-4 w-4" />
                  Edit cohort
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to={getMembersPath(workshopId, cohort.id)}>
                  <Users className="h-4 w-4" />
                  View members
                </Link>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                    disabled={!canDelete || deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete cohort
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this cohort?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Only cohorts without held seats can be deleted. This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate(cohort.id)}
                    >
                      Delete cohort
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </section>

        {!canEditPricingFields ? (
          <div className="rounded-lg border border-warning/20 bg-warning-muted px-4 py-3 text-sm text-foreground">
            Held seats already exist. Pricing, currency, and start date are
            locked.
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Seats" value={formatCohortSeatLabel(cohort)} />
          <MetricCard label="Held seats" value={`${cohort.heldSeats} total`} />
          <MetricCard label="Timezone" value={cohort.workshopTimezone} />
          <MetricCard
            label="Active members"
            value={String(cohort.activeSeats)}
          />
        </section>

        <section>
          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Cohort details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 border-t border-border/70 pt-6">
              <DetailRow
                label="Starts"
                value={formatCalendarDate(cohort.startDate)}
              />
              <DetailRow
                label="Price"
                value={formatCurrencyAmount(
                  cohort.spotPriceAmount,
                  cohort.currency,
                )}
              />
              <DetailRow
                label="First session"
                value={formatDateTime(cohort.firstSessionStartsAt)}
              />
              <DetailRow
                label="Last session"
                value={formatDateTime(cohort.lastSessionStartsAt)}
              />
              <DetailRow
                label="Created"
                value={formatDateTime(cohort.createdAt)}
              />
              <DetailRow
                label="Updated"
                value={formatDateTime(cohort.updatedAt)}
              />
            </CardContent>
          </Card>
        </section>

        <CohortSessionList sessions={cohort.sessions} />
      </main>
    </div>
  );
};

const MetricCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="space-y-1">
        <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </p>
        <CardTitle className="text-2xl font-semibold text-foreground">
          {value}
        </CardTitle>
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

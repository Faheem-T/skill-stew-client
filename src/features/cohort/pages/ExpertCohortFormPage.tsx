import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ArrowLeft, CalendarDays, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import {
  createCohortRequest,
  updateCohortRequest,
} from "@/features/cohort/api/cohorts";
import { CohortSessionList } from "@/features/cohort/components/CohortSessionList";
import {
  canEditCohortPricing,
  formatCurrencyAmount,
} from "@/features/cohort/lib/cohort";
import { cohortFormSchema, type CohortFormValues } from "@/features/cohort/schemas";
import { useExpertCohortDetails } from "@/features/cohort/hooks/useExpertCohortDetails";
import { EXPERT_COHORTS_QUERY_KEY } from "@/features/cohort/hooks/useExpertCohorts";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Calendar } from "@/shared/components/ui/calendar";
import { RoutePath } from "@/shared/config/routes";
import { useExpertWorkshopDetails } from "@/features/workshop/hooks/useExpertWorkshopDetails";
import { EXPERT_WORKSHOP_DETAILS_QUERY_KEY } from "@/features/workshop/hooks/useExpertWorkshopDetails";
import {
  getApiErrorItems,
  mapErrorsByField,
  sortWorkshopSessions,
  toJavaScriptDayOfWeek,
  WEEKDAY_OPTIONS,
} from "@/features/workshop/lib/workshop";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";

const getWorkshopPath = (workshopId: string) =>
  RoutePath.ExpertWorkshopDetail.replace(":id", workshopId);

const getCohortPath = (workshopId: string, cohortId: string) =>
  RoutePath.ExpertWorkshopCohortDetail.replace(":workshopId", workshopId).replace(
    ":cohortId",
    cohortId,
  );

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDateInputValue = (value: string) => {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
};

const startOfToday = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

export const ExpertCohortFormPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { workshopId = "", cohortId = "" } = useParams();
  const isEditMode = Boolean(cohortId);

  const { data: workshop, isLoading: isLoadingWorkshop } =
    useExpertWorkshopDetails(workshopId, Boolean(workshopId));
  const {
    data: cohort,
    isLoading: isLoadingCohort,
    error: cohortError,
  } = useExpertCohortDetails(cohortId, isEditMode);

  const canEditPricing = cohort ? canEditCohortPricing(cohort) : true;
  const earliestSession = useMemo(() => {
    if (!workshop) {
      return null;
    }

    return sortWorkshopSessions(workshop.sessions)[0] ?? null;
  }, [workshop]);
  const requiredStartDay = earliestSession?.dayOfWeek ?? null;
  const requiredStartDayLabel =
    requiredStartDay !== null
      ? (WEEKDAY_OPTIONS.find((option) => option.value === requiredStartDay)?.label ??
        "matching day")
      : "matching day";

  const form = useForm<CohortFormValues>({
    resolver: zodResolver(cohortFormSchema),
    values: {
      startDate: cohort?.startDate ?? "",
      spotPriceAmount: cohort ? String(cohort.spotPriceAmount) : "0",
      currency: cohort?.currency ?? "INR",
      maxStudents: cohort
        ? String(cohort.maxStudents)
        : workshop
      ? String(workshop.maxCohortSize)
          : "",
    },
  });
  const selectedStartDateValue = useWatch({
    control: form.control,
    name: "startDate",
  });
  const selectedStartDate = parseDateInputValue(selectedStartDateValue);

  const createMutation = useMutation({
    mutationFn: createCohortRequest,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [EXPERT_COHORTS_QUERY_KEY],
      });
      await queryClient.invalidateQueries({
        queryKey: [EXPERT_WORKSHOP_DETAILS_QUERY_KEY, workshopId],
      });
      navigate(getCohortPath(workshopId, response.data.id), { replace: true });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof updateCohortRequest>[1] }) =>
      updateCohortRequest(id, body),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [EXPERT_COHORTS_QUERY_KEY],
      });
      await queryClient.invalidateQueries({
        queryKey: [EXPERT_WORKSHOP_DETAILS_QUERY_KEY, workshopId],
      });
      navigate(getCohortPath(workshopId, response.data.id), { replace: true });
    },
  });

  const structureOnlySessions = useMemo(() => {
    if (!workshop) {
      return [];
    }

    return workshop.sessions.map((session) => ({
      ...session,
      date: cohort?.startDate ?? new Date().toISOString().slice(0, 10),
      startsAt: cohort?.firstSessionStartsAt ?? new Date().toISOString(),
    }));
  }, [cohort?.firstSessionStartsAt, cohort?.startDate, workshop]);

  const isBusy = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (values: CohortFormValues) => {
    form.clearErrors("root");

    const payload = {
      startDate: values.startDate,
      spotPriceAmount: Number(values.spotPriceAmount),
      currency: values.currency.toUpperCase(),
      maxStudents: Number(values.maxStudents),
    };

    try {
      if (isEditMode && cohort) {
        await updateMutation.mutateAsync({
          id: cohort.id,
          body: canEditPricing
            ? payload
            : {
                maxStudents: payload.maxStudents,
              },
        });
        return;
      }

      await createMutation.mutateAsync({
        ...payload,
        workshopId,
      });
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        form.setError("root", {
          type: "manual",
          message: "Unable to save the cohort right now.",
        });
        return;
      }

      const apiError = error as ApiErrorResponseType;
      const errorsByField = mapErrorsByField(getApiErrorItems(apiError));

      (["startDate", "spotPriceAmount", "currency", "maxStudents"] as const).forEach(
        (field) => {
          const message = errorsByField[field]?.[0];
          if (message) {
            form.setError(field, {
              type: "manual",
              message,
            });
          }
        },
      );

      if (!form.formState.errors.root) {
        form.setError("root", {
          type: "manual",
          message:
            apiError.response?.data?.errors?.[0]?.message ??
            "Unable to save the cohort right now.",
        });
      }
    }
  };

  if (isLoadingWorkshop || isLoadingCohort) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
          <div className="h-10 animate-pulse rounded bg-muted" />
        </main>
      </div>
    );
  }

  if (!workshop || (isEditMode && !cohort)) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-10">
          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-foreground">
                {cohortError?.response?.status === 404
                  ? "Cohort not found"
                  : "Unable to open cohort form"}
              </CardTitle>
              <CardDescription className="leading-6">
                {cohortError?.response?.data?.errors?.[0]?.message ??
                  "The cohort could not be loaded."}
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

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="border-border/80 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-foreground">
                {isEditMode ? "Edit cohort" : "Create cohort"}
              </CardTitle>
            </CardHeader>
            <CardContent className="border-t border-border/70 pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-5"
                >
                  {!canEditPricing && cohort ? (
                    <div className="rounded-lg border border-warning/20 bg-warning-muted px-4 py-3 text-sm text-foreground">
                      Held seats already exist. Only capacity can change.
                    </div>
                  ) : null}

                  <FormField
                    name="startDate"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start date</FormLabel>
                        <div className="space-y-4">
                          <div className="rounded-lg border border-border bg-secondary/30 px-4 py-4">
                            <div className="flex items-start gap-3">
                              <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
                              <div className="text-sm font-medium text-foreground">
                                Choose a {requiredStartDayLabel} start date
                              </div>
                            </div>
                          </div>

                          <FormControl>
                            <div className="rounded-lg border border-border bg-background">
                              <Calendar
                                mode="single"
                                selected={selectedStartDate}
                                onSelect={(date) => {
                                  if (!date) {
                                    return;
                                  }

                                  field.onChange(toDateInputValue(date));
                                }}
                                disabled={(date) => {
                                  const today = startOfToday();
                                  if (date < today) {
                                    return true;
                                  }

                                  if (requiredStartDay === null) {
                                    return false;
                                  }

                                  return (
                                    date.getDay() !==
                                    toJavaScriptDayOfWeek(requiredStartDay)
                                  );
                                }}
                                className="w-full"
                              />
                            </div>
                          </FormControl>

                          <Input
                            type="hidden"
                            disabled={isEditMode && !canEditPricing}
                            {...field}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                      name="spotPriceAmount"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spot price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              disabled={isEditMode && !canEditPricing}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="currency"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isEditMode && !canEditPricing}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    name="maxStudents"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum seats</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.formState.errors.root ? (
                    <div className="rounded-lg border border-destructive/30 px-4 py-3 text-sm text-destructive">
                      {form.formState.errors.root.message}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={isBusy}>
                      {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {isEditMode ? "Save cohort" : "Create cohort"}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link to={getWorkshopPath(workshopId)}>Cancel</Link>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/80 shadow-none">
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Workshop blueprint
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 border-t border-border/70 pt-6 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{workshop.title}</p>
                <p>Timezone: {workshop.timezone || "Not set"}</p>
                <p>Workshop max cohort size: {workshop.maxCohortSize}</p>
                {cohort ? (
                  <p>
                    Current price:{" "}
                    {formatCurrencyAmount(cohort.spotPriceAmount, cohort.currency)}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </section>

        {structureOnlySessions.length > 0 ? (
          <CohortSessionList
            sessions={structureOnlySessions}
            title={isEditMode ? "Cohort session calendar" : "Workshop session structure"}
            showDerivedDate={isEditMode}
          />
        ) : null}
      </main>
    </div>
  );
};

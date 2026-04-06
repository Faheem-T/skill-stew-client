import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { AppNavbar } from "@/shared/components/layout/AppNavbar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { createWorkshopRequest } from "@/features/workshop/api/createWorkshop";
import { publishWorkshopRequest } from "@/features/workshop/api/publishWorkshop";
import { replaceWorkshopSessionsRequest } from "@/features/workshop/api/replaceWorkshopSessions";
import { updateWorkshopSessionRequest } from "@/features/workshop/api/updateWorkshopSession";
import { updateWorkshopRequest } from "@/features/workshop/api/updateWorkshop";
import {
  workshopBasicsSchema,
  type WorkshopBasicsFormValues,
} from "@/features/workshop/schemas";
import {
  getApiErrorItems,
  getGeneralErrorMessage,
  getPublishSection,
  mapErrorsByField,
  sortWorkshopSessions,
  toSessionEditorItems,
} from "@/features/workshop/lib/workshop";
import {
  createDefaultScheduleSession,
  createNextScheduleSession,
  getBrowserTimezone,
  normalizeScheduleSessions,
  type ReviewErrorGroup,
  type WizardStatus,
  type WizardStep,
} from "@/features/workshop/lib/wizard";
import type {
  ScheduleDraftSession,
  SessionEditorItem,
  Workshop,
} from "@/features/workshop/types/types";
import type { ApiErrorItem } from "@/features/workshop/types/types";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";
import { useCurrentUserProfile } from "@/shared/hooks/useCurrentUserProfile";
import { useImageFileUpload } from "@/shared/hooks/useImageFileUpload";
import { useUploadToS3 } from "@/shared/hooks/useUploadToS3";
import { RoutePath } from "@/shared/config/routes";
import { WorkshopBasicsStep } from "@/features/workshop/components/WorkshopBasicsStep";
import { WorkshopScheduleStep } from "@/features/workshop/components/WorkshopScheduleStep";
import { WorkshopSessionDetailsStep } from "@/features/workshop/components/WorkshopSessionDetailsStep";
import { WorkshopReviewStep } from "@/features/workshop/components/WorkshopReviewStep";
import { WorkshopStepRail } from "@/features/workshop/components/WorkshopStepRail";
import {
  CompletionRulesCard,
  WorkshopSummaryCard,
} from "@/features/workshop/components/WorkshopWizardShared";
import {
  WorkshopPublishedPanel,
  WorkshopUnavailablePanel,
} from "@/features/workshop/components/WorkshopStatusPanels";
import { useExpertWorkshopDetails } from "@/features/workshop/hooks/useExpertWorkshopDetails";
import { useExpertCohorts } from "@/features/cohort/hooks/useExpertCohorts";

export const WorkshopCreatePage = () => {
  const navigate = useNavigate();
  const { id: routeWorkshopId } = useParams();
  const isEditMode = Boolean(routeWorkshopId);
  const { data: userProfile } = useCurrentUserProfile();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [wizardStatus, setWizardStatus] = useState<WizardStatus>({
    kind: "ready",
  });
  const [scheduleTimezone, setScheduleTimezone] =
    useState(getBrowserTimezone());
  const [scheduleSessions, setScheduleSessions] = useState<
    ScheduleDraftSession[]
  >(() => normalizeScheduleSessions([createDefaultScheduleSession(0)]));
  const [scheduleErrors, setScheduleErrors] = useState<string[]>([]);
  const [scheduleMessage, setScheduleMessage] = useState<string | null>(null);
  const [sessionEditors, setSessionEditors] = useState<SessionEditorItem[]>([]);
  const [reviewErrors, setReviewErrors] = useState<ReviewErrorGroup[]>([]);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [basicsMessage, setBasicsMessage] = useState<string | null>(null);

  const {
    selectedFile,
    previewUrl,
    fileInputRef,
    onPickFile,
    handleFileSelected,
    handleUndoSelection,
  } = useImageFileUpload("workshopBanner");
  const { upload, isUploading } = useUploadToS3();
  const {
    data: loadedWorkshop,
    isLoading: isLoadingWorkshop,
    error: workshopLoadError,
  } = useExpertWorkshopDetails(routeWorkshopId ?? "", isEditMode);
  const {
    data: workshopCohorts,
    isLoading: isLoadingWorkshopCohorts,
  } = useExpertCohorts(
    isEditMode && routeWorkshopId
      ? {
          workshopId: routeWorkshopId,
        }
      : undefined,
  );

  const basicsForm = useForm<WorkshopBasicsFormValues>({
    resolver: zodResolver(workshopBasicsSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      targetAudience: "",
      maxCohortSize: "",
      bannerImageKey: null,
    },
  });

  useEffect(() => {
    if (!workshop) {
      return;
    }

    basicsForm.reset({
      title: workshop.title,
      description: workshop.description ?? "",
      targetAudience: workshop.targetAudience ?? "",
      maxCohortSize: String(workshop.maxCohortSize),
      bannerImageKey: workshop.bannerImageKey,
    });

    if (workshop.timezone) {
      setScheduleTimezone(workshop.timezone);
    }
  }, [basicsForm, workshop]);

  useEffect(() => {
    if (!isEditMode || !loadedWorkshop) {
      return;
    }

    if (loadedWorkshop.status !== "draft") {
      setWorkshop(loadedWorkshop);
      setWizardStatus({
        kind: "locked",
        message: "Only draft workshops can be edited.",
      });
      return;
    }

    setWizardStatus({ kind: "ready" });
    setWorkshop(loadedWorkshop);
    setCurrentStep(1);
    setScheduleErrors([]);
    setScheduleMessage(null);
    setReviewErrors([]);
    setReviewMessage(null);
    setBasicsMessage(null);
    setScheduleTimezone(loadedWorkshop.timezone ?? getBrowserTimezone());
    setScheduleSessions(
      loadedWorkshop.sessions.length > 0
        ? normalizeScheduleSessions(
            loadedWorkshop.sessions.map((session) => ({
              localId: session.id,
              weekNumber: session.weekNumber,
              dayOfWeek: session.dayOfWeek,
              sessionOrder: session.sessionOrder,
              startTime: session.startTime,
            })),
          )
        : normalizeScheduleSessions([createDefaultScheduleSession(0)]),
    );
    setSessionEditors(toSessionEditorItems(loadedWorkshop.sessions));
  }, [isEditMode, loadedWorkshop]);

  const createWorkshopMutation = useMutation({
    mutationFn: createWorkshopRequest,
  });

  const updateWorkshopMutation = useMutation({
    mutationFn: ({
      workshopId,
      body,
    }: {
      workshopId: string;
      body: Parameters<typeof updateWorkshopRequest>[1];
    }) => updateWorkshopRequest(workshopId, body),
  });

  const replaceSessionsMutation = useMutation({
    mutationFn: ({
      workshopId,
      timezone,
      sessions,
    }: {
      workshopId: string;
      timezone: string;
      sessions: ScheduleDraftSession[];
    }) =>
      replaceWorkshopSessionsRequest(workshopId, {
        timezone,
        sessions: sessions.map((session) => ({
          weekNumber: session.weekNumber,
          dayOfWeek: session.dayOfWeek,
          sessionOrder: session.sessionOrder,
          startTime: session.startTime,
        })),
      }),
  });

  const publishWorkshopMutation = useMutation({
    mutationFn: publishWorkshopRequest,
  });

  const watchedTitle = basicsForm.watch("title");
  const watchedDescription = basicsForm.watch("description");
  const watchedAudience = basicsForm.watch("targetAudience");
  const watchedMaxCohortSize = basicsForm.watch("maxCohortSize");

  const summary = {
    title: watchedTitle || "Untitled workshop",
    description: watchedDescription || "No description added yet.",
    targetAudience: watchedAudience || "Audience not described yet.",
    maxCohortSize: watchedMaxCohortSize || "Not set",
  };

  const bannerPreview = previewUrl ?? workshop?.bannerImageUrl ?? null;
  const isDraftCreated = Boolean(workshop?.id);
  const canOpenSchedule = isDraftCreated;
  const canOpenSessionDetails = isDraftCreated && sessionEditors.length > 0;
  const canOpenReview = canOpenSessionDetails;

  const stepAvailability: Record<WizardStep, boolean> = {
    1: true,
    2: canOpenSchedule,
    3: canOpenSessionDetails,
    4: canOpenReview,
  };

  const handleMutationStateError = (error: ApiErrorResponseType) => {
    const status = error.response?.status;
    const message = getGeneralErrorMessage(
      error,
      "Something went wrong while updating the workshop.",
    );

    if (status === 403) {
      setWizardStatus({ kind: "forbidden", message });
      return true;
    }

    if (status === 404) {
      setWizardStatus({ kind: "missing", message });
      return true;
    }

    if (status === 409) {
      setWizardStatus({ kind: "locked", message });
      return true;
    }

    return false;
  };

  const submitBasics = async (values: WorkshopBasicsFormValues) => {
    setBasicsMessage(null);
    basicsForm.clearErrors("root");

    try {
      let bannerImageKey = values.bannerImageKey;

      if (selectedFile) {
        bannerImageKey = await upload(selectedFile, "workshopBanner");
      }

      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        targetAudience: values.targetAudience.trim(),
        maxCohortSize: Number(values.maxCohortSize),
        bannerImageKey,
      };

      const response = workshop?.id
        ? await updateWorkshopMutation.mutateAsync({
            workshopId: workshop.id,
            body: payload,
          })
        : await createWorkshopMutation.mutateAsync(payload);

      setWorkshop(response.data);
      basicsForm.setValue("bannerImageKey", response.data.bannerImageKey);
      if (selectedFile) {
        handleUndoSelection();
      }
      setCurrentStep(2);
      setBasicsMessage(
        workshop?.id
          ? "Basic details updated."
          : "Draft created. Set the schedule next.",
      );
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        basicsForm.setError("root", {
          type: "manual",
          message: "Unable to save workshop basics right now.",
        });
        return;
      }

      const apiError = error as ApiErrorResponseType;
      if (handleMutationStateError(apiError)) {
        return;
      }

      const errorsByField = mapErrorsByField(getApiErrorItems(apiError));
      const knownFields = [
        "title",
        "description",
        "targetAudience",
        "maxCohortSize",
        "bannerImageKey",
      ] as const;

      knownFields.forEach((field) => {
        const message = errorsByField[field]?.[0];
        if (message) {
          basicsForm.setError(field, { type: "manual", message });
        }
      });

      if (errorsByField.root?.[0]) {
        basicsForm.setError("root", {
          type: "manual",
          message: errorsByField.root[0],
        });
      } else if (Object.keys(errorsByField).length === 0) {
        basicsForm.setError("root", {
          type: "manual",
          message: "Unable to save workshop basics right now.",
        });
      }
    }
  };

  const validateScheduleDraft = () => {
    const errors: string[] = [];

    if (!scheduleTimezone) {
      errors.push("Select a workshop timezone before saving the schedule.");
    }

    if (scheduleSessions.length === 0) {
      errors.push("Add at least one session to create a workshop schedule.");
    }

    scheduleSessions.forEach((session, index) => {
      if (session.weekNumber < 1 || !Number.isInteger(session.weekNumber)) {
        errors.push(
          `Session ${index + 1}: week number must be a positive whole number.`,
        );
      }

      if (!/^\d{2}:\d{2}$/.test(session.startTime)) {
        errors.push(`Session ${index + 1}: start time must use HH:mm.`);
      }
    });

    return errors;
  };

  const submitSchedule = async () => {
    if (!workshop?.id) {
      setScheduleErrors([
        "Create the workshop draft before setting the schedule.",
      ]);
      return;
    }

    setScheduleMessage(null);
    const localErrors = validateScheduleDraft();
    if (localErrors.length > 0) {
      setScheduleErrors(localErrors);
      return;
    }

    setScheduleErrors([]);

    try {
      const normalizedSessions = normalizeScheduleSessions(scheduleSessions);
      setScheduleSessions(normalizedSessions);

      const response = await replaceSessionsMutation.mutateAsync({
        workshopId: workshop.id,
        timezone: scheduleTimezone,
        sessions: normalizedSessions,
      });

      setWorkshop({
        ...workshop,
        timezone: scheduleTimezone,
        sessions: sortWorkshopSessions(response.data),
        updatedAt: new Date().toISOString(),
      });
      setSessionEditors(toSessionEditorItems(response.data));
      setCurrentStep(3);
      setScheduleMessage(
        "Schedule saved. Session details are ready for final editing.",
      );
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        setScheduleErrors(["Unable to save the workshop schedule right now."]);
        return;
      }

      const apiError = error as ApiErrorResponseType;
      if (handleMutationStateError(apiError)) {
        return;
      }

      setScheduleErrors(getApiErrorItems(apiError).map((item) => item.message));
    }
  };

  const updateSessionEditorState = (
    sessionId: string,
    updater: (current: SessionEditorItem) => SessionEditorItem,
  ) => {
    setSessionEditors((currentItems) =>
      currentItems.map((item) =>
        item.id === sessionId ? updater(item) : item,
      ),
    );
  };

  const handleSessionFieldChange = (
    sessionId: string,
    field: "title" | "description" | "startTime",
    value: string,
  ) => {
    setSessionEditors((currentItems) =>
      currentItems.map((item) =>
        item.id === sessionId
          ? {
              ...item,
              [field]: value,
              saveState: item.saveState === "saving" ? "saving" : "idle",
              errorMessage: null,
            }
          : item,
      ),
    );
  };

  const saveSessionDetails = async (
    sessionId: string,
    payload: Pick<SessionEditorItem, "title" | "description" | "startTime">,
  ) => {
    if (!workshop?.id) {
      return;
    }

    updateSessionEditorState(sessionId, (current) => ({
      ...current,
      saveState: "saving",
      errorMessage: null,
    }));

    try {
      const response = await updateWorkshopSessionRequest(workshop.id, sessionId, {
        title: payload.title.trim(),
        description: payload.description.trim(),
        startTime: payload.startTime,
      });

      setSessionEditors((currentItems) =>
        sortWorkshopSessions(
          currentItems.map((item) =>
            item.id === sessionId
              ? {
                  ...item,
                  title: response.data.title ?? "",
                  description: response.data.description ?? "",
                  startTime: response.data.startTime,
                  saveState: "saved",
                  errorMessage: null,
                }
              : item,
          ),
        ),
      );

      setWorkshop((currentWorkshop) => {
        if (!currentWorkshop) {
          return currentWorkshop;
        }

        return {
          ...currentWorkshop,
          sessions: sortWorkshopSessions(
            currentWorkshop.sessions.map((session) =>
              session.id === sessionId ? response.data : session,
            ),
          ),
        };
      });
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        updateSessionEditorState(sessionId, (current) => ({
          ...current,
          saveState: "error",
          errorMessage: "Autosave failed.",
        }));
        return;
      }

      const apiError = error as ApiErrorResponseType;
      if (handleMutationStateError(apiError)) {
        return;
      }

      const status = apiError.response?.status;
      const message = getGeneralErrorMessage(apiError, "Autosave failed.");

      updateSessionEditorState(sessionId, (current) => ({
        ...current,
        saveState: "error",
        errorMessage: message,
      }));

      if (status === 404) {
        setScheduleMessage(
          "This session no longer exists. Rebuild the schedule to continue editing.",
        );
        setCurrentStep(2);
      }
    }
  };

  const submitPublish = async () => {
    if (!workshop?.id) {
      setReviewMessage("Create the workshop draft before publishing.");
      return;
    }

    setReviewMessage(null);
    setReviewErrors([]);

    try {
      const response = await publishWorkshopMutation.mutateAsync(workshop.id);
      setWorkshop(response.data);
      navigate(RoutePath.ExpertWorkshops, { replace: true });
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        setReviewMessage("Unable to publish the workshop right now.");
        return;
      }

      const apiError = error as ApiErrorResponseType;
      if (handleMutationStateError(apiError)) {
        return;
      }

      const errors = getApiErrorItems(apiError);
      if (apiError.response?.status === 422) {
        const grouped = errors.reduce<
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

        setReviewErrors(
          Object.entries(grouped)
            .filter(([, items]) => items.length > 0)
            .map(([section, items]) => ({
              section: section as ReviewErrorGroup["section"],
              items,
            })),
        );
        setReviewMessage(
          "Publishing is blocked until the missing details below are resolved.",
        );
        return;
      }

      setReviewMessage(
        errors[0]?.message ?? "Unable to publish the workshop right now.",
      );
    }
  };

  const isStepMutating =
    createWorkshopMutation.isPending ||
    updateWorkshopMutation.isPending ||
    replaceSessionsMutation.isPending ||
    publishWorkshopMutation.isPending ||
    isUploading;

  const renderMainContent = () => {
    if (
      isEditMode &&
      (isLoadingWorkshop || isLoadingWorkshopCohorts) &&
      !workshop
    ) {
      return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="h-24 animate-pulse rounded-lg bg-muted" />
            <div className="h-[520px] animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="h-[360px] animate-pulse rounded-lg bg-muted" />
        </div>
      );
    }

    if (isEditMode && (workshopCohorts?.length ?? 0) > 0) {
      return (
        <WorkshopUnavailablePanel
          status={{
            kind: "locked",
            message:
              "This workshop already has cohorts, so the workshop blueprint is frozen. Manage future changes from the cohort screens instead.",
          }}
        />
      );
    }

    if (isEditMode && workshopLoadError) {
      const status = workshopLoadError.response?.status;
      const message = getGeneralErrorMessage(
        workshopLoadError,
        "Unable to load this workshop right now.",
      );

      return (
        <WorkshopUnavailablePanel
          status={
            status === 403
              ? { kind: "forbidden", message }
              : status === 409
                ? { kind: "locked", message }
                : { kind: "missing", message }
          }
        />
      );
    }

    if (
      wizardStatus.kind === "forbidden" ||
      wizardStatus.kind === "locked" ||
      wizardStatus.kind === "missing"
    ) {
      return <WorkshopUnavailablePanel status={wizardStatus} />;
    }

    if (wizardStatus.kind === "published") {
      return <WorkshopPublishedPanel workshop={workshop} />;
    }

    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <WorkshopStepRail
            currentStep={currentStep}
            stepAvailability={stepAvailability}
            onSelectStep={(step) => {
              if (stepAvailability[step]) {
                setCurrentStep(step);
              }
            }}
          />

          {currentStep === 1 && (
            <WorkshopBasicsStep
              form={basicsForm}
              bannerPreview={bannerPreview}
              isDraftCreated={isDraftCreated}
              isPending={isStepMutating}
              isUploading={isUploading}
              fileInputRef={fileInputRef}
              onFilePick={onPickFile}
              onFileSelected={handleFileSelected}
              onUndoFile={handleUndoSelection}
              onSubmit={submitBasics}
              statusMessage={basicsMessage}
            />
          )}

          {currentStep === 2 && (
            <WorkshopScheduleStep
              timezone={scheduleTimezone}
              sessions={scheduleSessions}
              errors={scheduleErrors}
              message={scheduleMessage}
              isPending={replaceSessionsMutation.isPending}
              onTimezoneChange={setScheduleTimezone}
              onAddSession={() =>
                setScheduleSessions((current) =>
                  normalizeScheduleSessions([
                    ...current,
                    createNextScheduleSession(current),
                  ]),
                )
              }
              onRemoveSession={(localId) =>
                setScheduleSessions((current) =>
                  normalizeScheduleSessions(
                    current.filter((item) => item.localId !== localId),
                  ),
                )
              }
              onUpdateSession={(localId, field, value) =>
                setScheduleSessions((current) =>
                  normalizeScheduleSessions(
                    current.map((item) =>
                      item.localId === localId
                        ? { ...item, [field]: value }
                        : item,
                    ),
                  ),
                )
              }
              onSubmit={submitSchedule}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <WorkshopSessionDetailsStep
              items={sessionEditors}
              isLocked={isStepMutating}
              onBack={() => setCurrentStep(2)}
              onNext={() => setCurrentStep(4)}
              onFieldChange={handleSessionFieldChange}
              onSave={saveSessionDetails}
            />
          )}

          {currentStep === 4 && (
            <WorkshopReviewStep
              workshop={workshop}
              sessionEditors={sessionEditors}
              reviewErrors={reviewErrors}
              reviewMessage={reviewMessage}
              isPending={publishWorkshopMutation.isPending}
              onBack={() => setCurrentStep(3)}
              onPublish={submitPublish}
              onJumpToStep={setCurrentStep}
            />
          )}
        </div>

        <aside className="space-y-6">
          <WorkshopSummaryCard
            title={summary.title}
            description={summary.description}
            targetAudience={summary.targetAudience}
            maxCohortSize={summary.maxCohortSize}
            timezone={scheduleTimezone || "Not set"}
            sessionCount={sessionEditors.length || scheduleSessions.length}
            status={workshop?.status ?? "draft"}
            bannerPreview={bannerPreview}
          />
          <CompletionRulesCard
            hasTitle={Boolean(workshop?.title || summary.title)}
            hasCohortSize={Boolean(basicsForm.getValues("maxCohortSize"))}
            hasTimezone={Boolean(scheduleTimezone)}
            hasSchedule={sessionEditors.length > 0}
            everySessionTitled={
              sessionEditors.length > 0 &&
              sessionEditors.every((session) => session.title.trim().length > 0)
            }
          />
        </aside>
      </div>
    );
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
              Expert workshop builder
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {isEditMode
                  ? "Edit your workshop draft"
                  : "Create a workshop that is ready to run live"}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                {isEditMode
                  ? "Refine the draft, adjust the schedule, and publish when the workshop is ready."
                  : "Build the draft in four steps: define the workshop, structure the schedule, title each session, and publish when the cohort is complete."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(RoutePath.ExpertWorkshops)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to workshops
            </Button>
            <Badge className="rounded-sm bg-secondary text-secondary-foreground">
              {userProfile?.email ?? "Expert"}
            </Badge>
          </div>
        </section>

        {renderMainContent()}
      </main>
    </div>
  );
};

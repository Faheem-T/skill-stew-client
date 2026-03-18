import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  Clock,
  LogOut,
  Mic,
  Sparkles,
  Wifi,
  XCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router";

import {
  submitExpertApplication,
  submitExpertApplicationSchema,
  toSubmitExpertApplicationPayload,
  type SubmitExpertApplicationFormInput,
  type SubmitExpertApplicationFormValues,
} from "@/features/expert/api/SubmitExpertApplication";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
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
import { Textarea } from "@/shared/components/ui/textarea";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { APP_NAME } from "@/shared/config/constants";
import { RoutePath } from "@/shared/config/routes";
import { CURRENT_USER_PROFILE_QUERY_KEY } from "@/shared/hooks/useCurrentUserProfile";
import useCurrentUserProfile from "@/shared/hooks/useCurrentUserProfile";

const defaultValues: SubmitExpertApplicationFormInput = {
  fullName: "",
  phone: "",
  socialLinksInput: "",
  yearsExperience: 0,
  evidenceLinksInput: "",
  hasTeachingExperience: false,
  teachingExperienceDesc: "",
  bio: "",
  proposedTitle: "",
  proposedDescription: "",
  targetAudience: "",
  confirmedInternet: false,
  confirmedCamera: false,
  confirmedMicrophone: false,
  termsAgreed: false,
};

const readinessItems = [
  {
    icon: Wifi,
    title: "Stable internet",
    description: "You should be ready to host uninterrupted live sessions.",
    fieldName: "confirmedInternet",
  },
  {
    icon: Camera,
    title: "Working camera",
    description: "Participants should be able to see you clearly.",
    fieldName: "confirmedCamera",
  },
  {
    icon: Mic,
    title: "Clear microphone",
    description: "Audio quality matters more than polished production.",
    fieldName: "confirmedMicrophone",
  },
] as const;

// ─── Left Panel (shared across all states) ───

const LeftPanel = ({ children }: { children: React.ReactNode }) => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <section className="relative overflow-hidden rounded-4xl bg-primary px-6 py-8 text-white shadow-2xl lg:px-10 lg:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.24),transparent_30%),linear-gradient(160deg,rgba(255,255,255,0.04),rgba(0,0,0,0.12))]" />
      <div className="absolute -right-18 -top-12 h-44 w-44 rounded-full border border-white/12 bg-white/8 blur-2xl" />
      <div className="absolute -bottom-20 -left-8 h-52 w-52 rounded-full bg-accent/18 blur-3xl" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <Link
            to={RoutePath.Home}
            className="flex items-center gap-3 text-sm font-medium text-white/90"
          >
            <img src="/logo.png" className="h-10 w-10 object-contain" />
            <span>{APP_NAME}</span>
          </Link>

          <button
            type="button"
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="flex items-center gap-2 text-sm text-white/70 transition hover:text-white disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
        {children}
      </div>
    </section>
  );
};

// ─── VERIFICATION_PENDING state ───

const PendingView = () => (
  <div className="min-h-screen bg-[linear-gradient(180deg,#f6f7fb_0%,#eef3f8_46%,#ffffff_100%)]">
    <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-12">
      <LeftPanel>
        <div className="mt-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/75">
            <Clock className="h-3.5 w-3.5" />
            Under review
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance lg:text-5xl">
            Your application is being reviewed.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-white/72 lg:text-lg">
            We received everything we need. Our team reviews applications
            manually and will follow up once a decision has been made.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <p className="mt-3 text-sm font-medium">Application received</p>
            <p className="mt-1 text-sm leading-6 text-white/70">
              Your details and proof of work have been submitted.
            </p>
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
            <Clock className="h-5 w-5 text-accent" />
            <p className="mt-3 text-sm font-medium">Manual review</p>
            <p className="mt-1 text-sm leading-6 text-white/70">
              A team member will evaluate your expertise and workshop pitch.
            </p>
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
            <BadgeCheck className="h-5 w-5 text-accent" />
            <p className="mt-3 text-sm font-medium">Decision incoming</p>
            <p className="mt-1 text-sm leading-6 text-white/70">
              You will be notified once your application has been reviewed.
            </p>
          </div>
        </div>
      </LeftPanel>

      <section className="flex items-center justify-center">
        <Card className="w-full max-w-3xl border-white/70 bg-white/88 py-0 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur">
          <CardHeader className="border-b border-slate-200/70 px-6 py-6 sm:px-8">
            <CardTitle className="text-2xl text-slate-950">
              Application submitted
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
              Thanks for taking the time to apply. Here is what happens next.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-6 py-6 sm:px-8">
            <Alert className="border-amber-200 bg-amber-50">
              <Clock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                Your application is currently under review. We will reach out
                using the email on your account once a decision has been made.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                What to expect
              </h3>
              <ul className="space-y-3 text-sm leading-6 text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  Applications are reviewed in the order they are received.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  Strong evidence and a clear workshop pitch speed things up.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  You will receive an email notification with the result.
                </li>
              </ul>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full px-6"
              >
                <Link to={RoutePath.Home}>Back to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  </div>
);

// ─── REJECTED state ───

const RejectedView = () => (
  <div className="min-h-screen bg-[linear-gradient(180deg,#f6f7fb_0%,#eef3f8_46%,#ffffff_100%)]">
    <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-12">
      <LeftPanel>
        <div className="mt-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/75">
            <XCircle className="h-3.5 w-3.5" />
            Application update
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance lg:text-5xl">
            Your application was not approved.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-white/72 lg:text-lg">
            We appreciate the time you spent applying. Unfortunately, your
            application did not meet our current requirements.
          </p>
        </div>
      </LeftPanel>

      <section className="flex items-center justify-center">
        <Card className="w-full max-w-3xl border-white/70 bg-white/88 py-0 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur">
          <CardHeader className="border-b border-slate-200/70 px-6 py-6 sm:px-8">
            <CardTitle className="text-2xl text-slate-950">
              Application not approved
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
              Here is some guidance on what you can do next.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-6 py-6 sm:px-8">
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                After reviewing your submission, we were unable to approve your
                expert application at this time.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Possible next steps
              </h3>
              <ul className="space-y-3 text-sm leading-6 text-slate-600">
                <li className="flex items-start gap-3">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  Strengthen your evidence links with more proof of work.
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  Refine your workshop pitch with a clearer audience and
                  outcome.
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  If you believe this was a mistake, contact support for further
                  clarification.
                </li>
              </ul>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full px-6"
              >
                <Link to={RoutePath.Home}>Back to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  </div>
);

// ─── NOT_DONE state (the form) ───

const ApplicationForm = ({ expertId }: { expertId: string }) => {
  const queryClient = useQueryClient();

  const form = useForm<
    SubmitExpertApplicationFormInput,
    undefined,
    SubmitExpertApplicationFormValues
  >({
    resolver: zodResolver(submitExpertApplicationSchema),
    defaultValues,
  });

  const hasTeachingExperience = form.watch("hasTeachingExperience");

  const { mutate, isPending } = useMutation<
    Awaited<ReturnType<typeof submitExpertApplication>>,
    ApiErrorResponseType,
    SubmitExpertApplicationFormValues
  >({
    mutationFn: async (values) =>
      submitExpertApplication(
        toSubmitExpertApplicationPayload(values, expertId),
      ),
    onError(error) {
      const errors = error.response?.data?.errors;

      if (!errors?.length) {
        toast.error("Failed to submit application. Please try again.");
        return;
      }

      for (const { field, message } of errors) {
        if (
          field &&
          field in form.getValues() &&
          field !== "evidenceLinks" &&
          field !== "socialLinks" &&
          field !== "teachingExperienceDesc"
        ) {
          form.setError(field as keyof SubmitExpertApplicationFormInput, {
            message,
          });
          continue;
        }

        if (field === "evidenceLinks") {
          form.setError("evidenceLinksInput", { message });
          continue;
        }

        if (field === "socialLinks") {
          form.setError("socialLinksInput", { message });
          continue;
        }

        if (field === "teachingExperienceDesc") {
          form.setError("teachingExperienceDesc", { message });
          continue;
        }

        form.setError("root", { message });
      }
    },
    onSuccess(response) {
      toast.success(response.message || "Application submitted successfully.");
      queryClient.invalidateQueries({
        queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
      });
    },
  });

  const onSubmit = (values: SubmitExpertApplicationFormValues) => {
    form.clearErrors("root");
    mutate(values);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f7fb_0%,#eef3f8_46%,#ffffff_100%)]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-12">
        <LeftPanel>
          <div className="mt-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/75">
              <Sparkles className="h-3.5 w-3.5" />
              Expert application
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance lg:text-5xl">
              Pitch a workshop people will actually want to attend.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-white/72 lg:text-lg">
              Share your expertise, your proof of work, and the session you want
              to run. We review applications manually and follow up if the fit
              is right.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
              <BadgeCheck className="h-5 w-5 text-accent" />
              <p className="mt-3 text-sm font-medium">Proof-first review</p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                Portfolio links and real-world work matter more than buzzwords.
              </p>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
              <BriefcaseBusiness className="h-5 w-5 text-accent" />
              <p className="mt-3 text-sm font-medium">Workshop focused</p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                We want practical sessions with a clear audience and outcome.
              </p>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <p className="mt-3 text-sm font-medium">Fast next steps</p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                Strong applications are easy to review and easier to approve.
              </p>
            </div>
          </div>
        </LeftPanel>

        <section className="flex items-start justify-center">
          <Card className="w-full max-w-3xl border-white/70 bg-white/88 py-0 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur">
            <CardHeader className="border-b border-slate-200/70 px-6 py-6 sm:px-8">
              <CardTitle className="text-2xl text-slate-950">
                Become a Skill Stew expert
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
                Keep it direct. Strong applications explain who you are, what
                you have done, and what learners will get from your workshop.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 py-6 sm:px-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {form.formState.errors.root && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">
                        {form.formState.errors.root.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-5">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Identity
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Basic contact details so we know who is applying.
                      </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your full name"
                                className="h-11 border-slate-200 bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="+91 98765 43210"
                                className="h-11 border-slate-200 bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="socialLinksInput"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social links</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              placeholder={
                                "https://linkedin.com/in/your-profile\nhttps://github.com/your-username"
                              }
                              className="resize-y border-slate-200 bg-white"
                            />
                          </FormControl>
                          <p className="text-sm text-slate-500">
                            Add one URL per line. LinkedIn, GitHub, Twitter, or
                            personal website all work.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Bio
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Give reviewers a concise sense of your background.
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short bio</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={4}
                              placeholder="Summarize your background in a few strong sentences."
                              className="resize-y border-slate-200 bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Expertise
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Show the work behind your claim to expertise.
                      </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="yearsExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of experience</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                placeholder="5"
                                className="h-11 border-slate-200 bg-white"
                                name={field.name}
                                ref={field.ref}
                                onBlur={field.onBlur}
                                value={
                                  typeof field.value === "number"
                                    ? field.value
                                    : ""
                                }
                                onChange={(event) =>
                                  field.onChange(
                                    event.target.value === ""
                                      ? undefined
                                      : Number(event.target.value),
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasTeachingExperience"
                        render={({ field }) => (
                          <FormItem className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-start gap-3">
                              <input
                                id="hasTeachingExperience"
                                type="checkbox"
                                checked={field.value}
                                onChange={(event) =>
                                  field.onChange(event.target.checked)
                                }
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                              />
                              <div>
                                <FormLabel
                                  htmlFor="hasTeachingExperience"
                                  className="text-sm font-medium text-slate-800"
                                >
                                  I have prior teaching or mentoring experience
                                </FormLabel>
                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                  This can include workshops, cohorts,
                                  bootcamps, mentoring, or internal training.
                                </p>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="evidenceLinksInput"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Evidence links</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={5}
                              placeholder={
                                "https://github.com/you/project\nhttps://yourportfolio.com/case-study"
                              }
                              className="resize-y border-slate-200 bg-white"
                            />
                          </FormControl>
                          <p className="text-sm text-slate-500">
                            Add one URL per line. LinkedIn, portfolio, talks,
                            GitHub, or case studies all work.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {hasTeachingExperience && (
                      <FormField
                        control={form.control}
                        name="teachingExperienceDesc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teaching experience summary</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={4}
                                placeholder="Describe what you taught, to whom, and what format you used."
                                className="resize-y border-slate-200 bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Workshop pitch
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Tell us what you want to teach and who should attend.
                      </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="proposedTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proposed workshop title</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Practical Prompt Engineering for Product Teams"
                                className="h-11 border-slate-200 bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target audience</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Early-career developers, PMs, startup operators"
                                className="h-11 border-slate-200 bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="proposedDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proposed description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={5}
                              placeholder="Explain the structure, expected outcomes, and why this workshop is useful."
                              className="resize-y border-slate-200 bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Readiness and terms
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Confirm the minimum setup required to host a live
                        session.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      {readinessItems.map((item) => (
                        <FormField
                          key={item.fieldName}
                          control={form.control}
                          name={item.fieldName}
                          render={({ field }) => {
                            const Icon = item.icon;

                            return (
                              <FormItem className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start gap-3">
                                  <input
                                    id={item.fieldName}
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={(event) =>
                                      field.onChange(event.target.checked)
                                    }
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-4 w-4 text-slate-700" />
                                      <FormLabel
                                        htmlFor={item.fieldName}
                                        className="text-sm font-medium text-slate-800"
                                      >
                                        {item.title}
                                      </FormLabel>
                                    </div>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>

                    <FormField
                      control={form.control}
                      name="termsAgreed"
                      render={({ field }) => (
                        <FormItem className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-start gap-3">
                            <input
                              id="termsAgreed"
                              type="checkbox"
                              checked={field.value}
                              onChange={(event) =>
                                field.onChange(event.target.checked)
                              }
                              className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <div>
                              <FormLabel
                                htmlFor="termsAgreed"
                                className="text-sm font-medium text-slate-800"
                              >
                                I confirm these details are accurate and I agree
                                to be contacted about this application.
                              </FormLabel>
                              <p className="mt-1 text-sm leading-6 text-slate-500">
                                By submitting, you confirm the application is
                                your own and the linked evidence represents your
                                work truthfully.
                              </p>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-6 text-slate-500">
                      Applications are reviewed manually. Clear, concrete
                      submissions move faster.
                    </p>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isPending}
                      className="h-11 rounded-full px-6"
                    >
                      {isPending ? "Submitting..." : "Submit application"}
                      {!isPending && <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

// ─── Page entry point ───

export const ExpertApplicationPage = () => {
  const { data: userProfile } = useCurrentUserProfile();

  if (!userProfile || userProfile.role !== "EXPERT_APPLICANT") {
    return null;
  }

  switch (userProfile.applicationStatus) {
    case "VERIFICATION_PENDING":
      return <PendingView />;
    case "REJECTED":
      return <RejectedView />;
    case "NOT_DONE":
    default:
      return <ApplicationForm expertId={userProfile.id} />;
  }
};

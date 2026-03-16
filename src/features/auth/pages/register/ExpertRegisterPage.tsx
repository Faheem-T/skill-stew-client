import { ArrowRight, BadgeCheck, BriefcaseBusiness, Mail } from "lucide-react";
import { useNavigate } from "react-router";
import { ExpertRegisterForm } from "@/features/auth/components/ExpertRegisterForm";
import { APP_NAME } from "@/shared/config/constants";
import { RoutePath } from "@/shared/config/routes";

export const ExpertRegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden bg-primary px-6 py-12 text-primary-foreground sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_28%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="flex items-center gap-3">
              <img src="/logo.png" className="h-11 w-11 object-contain" />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-primary-foreground/70">
                  Skill Stew
                </p>
                <h1 className="text-2xl font-bold">{APP_NAME}</h1>
              </div>
            </div>

            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90">
                <BadgeCheck className="h-4 w-4" />
                Expert onboarding
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
                  Teach live cohorts with a profile built for trust.
                </h2>
                <p className="max-w-lg text-base leading-7 text-white/80 sm:text-lg">
                  Start with your account, verify your email, then move into the
                  expert approval flow for workshops and future cohorts.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <Mail className="h-5 w-5 text-accent" />
                <p className="mt-4 text-sm font-semibold">Verify email</p>
                <p className="mt-2 text-sm text-white/70">
                  Confirm your inbox before entering the expert pipeline.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <BadgeCheck className="h-5 w-5 text-accent" />
                <p className="mt-4 text-sm font-semibold">Build credibility</p>
                <p className="mt-2 text-sm text-white/70">
                  Use a dedicated expert account for verification and teaching.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <BriefcaseBusiness className="h-5 w-5 text-accent" />
                <p className="mt-4 text-sm font-semibold">Lead workshops</p>
                <p className="mt-2 text-sm text-white/70">
                  Prepare for cohort creation, live sessions, and learner
                  engagement.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="w-full max-w-xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-600">
              <button
                type="button"
                onClick={() => navigate(RoutePath.Home)}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 font-medium text-stone-700 transition hover:border-primary hover:text-primary"
              >
                Explore platform
              </button>
              <p>
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => navigate(RoutePath.Login)}
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>

            <ExpertRegisterForm />

            <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm text-stone-600">
              <p>Need to become an expert after creating your account?</p>
              <button
                type="button"
                onClick={() => navigate(RoutePath.ExpertApplication)}
                className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
              >
                View expert flow
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

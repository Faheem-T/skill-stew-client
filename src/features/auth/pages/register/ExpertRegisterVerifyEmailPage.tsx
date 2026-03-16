import { CheckCircle2, ChevronRight, MailCheck } from "lucide-react";
import { Link, useLocation } from "react-router";
import { ResendButton } from "@/features/auth/components/ResendVerifyLinkButton";
import { APP_NAME } from "@/shared/config/constants";
import { RoutePath } from "@/shared/config/routes";

type ExpertRegisterVerifyLocationState = {
  email?: string;
};

export const ExpertRegisterVerifyEmailPage = () => {
  const location = useLocation();
  const state = location.state as ExpertRegisterVerifyLocationState | null;
  const email = state?.email;

  return (
    <div className="min-h-screen bg-stone-100 px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col overflow-hidden rounded-4xl border border-stone-200 bg-white shadow-[0_30px_120px_-70px_rgba(68,26,26,0.45)] lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex flex-col justify-between bg-primary px-8 py-10 text-primary-foreground sm:px-10 lg:px-12 lg:py-12">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="h-11 w-11 object-contain" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-primary-foreground/70">
                Expert onboarding
              </p>
              <h1 className="text-2xl font-bold">{APP_NAME}</h1>
            </div>
          </div>

          <div className="space-y-5">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <MailCheck className="h-7 w-7 text-accent" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold leading-tight">
                Check your inbox to continue.
              </h2>
              <p className="max-w-md text-base leading-7 text-white/80">
                We sent a verification link so we can confirm you own the email
                for this expert account.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-sm text-white/80">
            <div className="flex items-center gap-3 font-semibold text-white">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              What happens next
            </div>
            <p className="mt-3 leading-6">
              Verify the email first, then sign in and continue through the
              expert approval process when that flow is available to you.
            </p>
          </div>
        </section>

        <section className="flex items-center px-8 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="w-full max-w-xl space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Email verification
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-stone-900">
                Your expert account is almost ready.
              </h3>
              <p className="text-base leading-7 text-stone-600">
                Open the email from Skill Stew and click the verification link.
                After that, you can sign in normally.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                Verification destination
              </p>
              <p className="mt-3 text-lg font-semibold text-stone-900">
                {email ?? "Your registered email address"}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {email
                  ? "If you don’t see the message, check spam or resend the verification email."
                  : "If you arrived here directly, use the resend action only if you already completed expert registration."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={RoutePath.Login}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Back to sign in
                <ChevronRight className="h-4 w-4" />
              </Link>
              {email ? (
                <ResendButton
                  email={email}
                  className="h-12 rounded-xl border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                />
              ) : null}
            </div>

            <p className="text-sm leading-6 text-stone-500">
              Want a standard learner account instead?{" "}
              <Link
                to={RoutePath.Register}
                className="font-semibold text-primary hover:underline"
              >
                Use the regular sign up flow
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

import { CheckCircle2, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { ResendButton } from "@/features/auth/components/ResendVerifyLinkButton";
import { APP_NAME } from "@/shared/config/constants";
import { RoutePath } from "@/shared/config/routes";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";

type ExpertRegisterVerifyLocationState = {
  email?: string;
};

export const ExpertRegisterVerifyEmailPage = () => {
  const location = useLocation();
  const state = location.state as ExpertRegisterVerifyLocationState | null;
  const email = state?.email;

  return (
    <AuthSplitLayout
      eyebrow="Email verification"
      title="Check your inbox to continue."
      description="We sent a verification link so we can confirm ownership of this expert account before sign-in."
      aside={
        <div className="bg-background border-border rounded-lg border p-6">
          <CheckCircle2 className="text-primary h-5 w-5" strokeWidth={1.5} />
          <p className="mt-6 text-sm font-semibold">What happens next</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Verify the email first, then sign in and continue through the
            expert approval process when that flow becomes available to you.
          </p>
        </div>
      }
    >
      <div className="bg-card border-border rounded-lg border p-8">
        <div className="space-y-3">
          <div className="bg-secondary text-secondary-foreground inline-flex items-center rounded-sm border border-transparent px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em]">
            Email verification
          </div>
          <h3 className="text-2xl font-semibold text-foreground">
            Your expert account is almost ready.
          </h3>
          <p className="text-muted-foreground text-base">
            Open the email from {APP_NAME} and click the verification link.
            After that, you can sign in normally.
          </p>
        </div>

        <div className="bg-background border-border mt-8 rounded-lg border p-6">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
            Verification destination
          </p>
          <p className="mt-3 text-lg font-semibold text-foreground">
            {email ?? "Your registered email address"}
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            {email
              ? "If you don’t see the message, check spam or resend the verification email."
              : "If you arrived here directly, use the resend action only if you already completed expert registration."}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to={RoutePath.Login}
            className="bg-primary text-primary-foreground inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium"
          >
            Back to sign in
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          {email ? (
            <ResendButton
              email={email}
              className="h-11 rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground hover:border-primary"
            />
          ) : null}
        </div>
      </div>

      <p className="text-muted-foreground text-sm">
        Want a standard learner account instead?{" "}
        <Link
          to={RoutePath.Register}
          className="text-foreground underline underline-offset-4"
        >
          Use the regular sign up flow
        </Link>
        .
      </p>
    </AuthSplitLayout>
  );
};

import { BadgeCheck, BriefcaseBusiness, Mail } from "lucide-react";
import { useNavigate } from "react-router";
import { ExpertRegisterForm } from "@/features/auth/components/ExpertRegisterForm";
import { RoutePath } from "@/shared/config/routes";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";

export const ExpertRegisterPage = () => {
  const navigate = useNavigate();

  return (
    <AuthSplitLayout
      eyebrow="Expert onboarding"
      title="Teach with a profile built for trust."
      description="Create your account first, verify your email, and then continue into the expert approval flow for workshops and cohorts."
      aside={
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Mail,
              title: "Verify email",
              body: "Confirm your inbox before entering the expert pipeline.",
            },
            {
              icon: BadgeCheck,
              title: "Build credibility",
              body: "Use a dedicated account for expert review and teaching.",
            },
            {
              icon: BriefcaseBusiness,
              title: "Lead workshops",
              body: "Prepare for live sessions, cohorts, and learner support.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-background border-border rounded-lg border p-6">
              <Icon className="text-primary h-5 w-5" strokeWidth={1.5} />
              <p className="mt-6 text-sm font-semibold">{title}</p>
              <p className="text-muted-foreground mt-2 text-sm">{body}</p>
            </div>
          ))}
        </div>
      }
    >
      <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-sm">
        <button
          type="button"
          onClick={() => navigate(RoutePath.Home)}
          className="underline underline-offset-4"
        >
          Explore platform
        </button>
        <button
          type="button"
          onClick={() => navigate(RoutePath.Login)}
          className="text-foreground underline underline-offset-4"
        >
          Already registered?
        </button>
      </div>

      <ExpertRegisterForm />
    </AuthSplitLayout>
  );
};

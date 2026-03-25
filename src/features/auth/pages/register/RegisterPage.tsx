import { useNavigate } from "react-router";
import { RegisterForm } from "../../components/RegisterForm";
import { BadgeCheck, BookOpen, Users } from "lucide-react";
import { RoutePath } from "@/shared/config/routes";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { Link } from "react-router";

export const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <AuthSplitLayout
      eyebrow="Learner sign up"
      title="Build a steadier way to learn."
      description="Create your Skill Stew account to join expert-led cohorts, track progress, and connect with people learning alongside you."
      aside={
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "Structured workshops",
              body: "Choose sessions built around live teaching and completion.",
            },
            {
              icon: Users,
              title: "Cohort support",
              body: "Stay close to peers, discussions, and accountability.",
            },
            {
              icon: BadgeCheck,
              title: "Expert trust",
              body: "Learn from instructors shaped by a verification process.",
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
      footer={
        <p className="text-muted-foreground text-sm">
          By signing up, you agree to our{" "}
          <a href="#" className="text-foreground underline underline-offset-4">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-foreground underline underline-offset-4">
            Privacy Policy
          </a>
          .
        </p>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <button
          className="text-foreground font-medium underline underline-offset-4"
          onClick={() => navigate(RoutePath.Login)}
          type="button"
        >
          Already have an account?
        </button>
        <button
          className="text-muted-foreground underline underline-offset-4"
          onClick={() => navigate(RoutePath.ExpertRegister)}
          type="button"
        >
          Register as an expert instead
        </button>
      </div>

      <RegisterForm />

      <p className="text-muted-foreground text-sm">
        Want a teaching profile?{" "}
        <Link
          to={RoutePath.ExpertRegister}
          className="text-foreground underline underline-offset-4"
        >
          Start the expert route
        </Link>
        .
      </p>
    </AuthSplitLayout>
  );
};

import { Button } from "@/shared/components/ui/button";
import type React from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { RoutePath } from "@/shared/config/routes";

export const CTASection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-20">
        <div className="bg-card border-border rounded-lg border p-8 md:p-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
                Start learning
              </p>
              <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground md:text-4xl lg:text-5xl">
                Ready to start learning?
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl text-lg">
                Join a platform built around live teaching, trusted experts,
                and workshop momentum that lasts beyond a single session.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="px-8"
                onClick={() => navigate(RoutePath.Register)}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8"
                onClick={() => navigate(RoutePath.Login)}
              >
                Log In
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-background border-border mt-8 rounded-lg border p-8 md:flex md:items-center md:justify-between md:p-12">
          <div>
            <h3 className="text-2xl font-semibold text-foreground md:text-3xl">
              Are you a professional?
            </h3>
            <p className="text-muted-foreground mt-2">
              Start teaching and earning by becoming a verified expert.
            </p>
          </div>
          <Button
            size="lg"
            className="mt-6 px-6 md:mt-0"
            onClick={() => navigate(RoutePath.ExpertRegister)}
          >
            Apply to become an Expert
          </Button>
        </div>
      </div>
    </section>
  );
};

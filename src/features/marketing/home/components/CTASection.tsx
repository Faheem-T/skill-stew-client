import { Button } from "@/shared/components/ui/button";
import type React from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { RoutePath } from "@/shared/config/routes";

export const CTASection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-12">
        {/* Main CTA */}
        <div className="bg-primary rounded-xl p-8 md:p-16 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Ready to start learning?
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
              Join our community of learners and teachers. Your next skill is
              just a click away.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-lg px-8 h-12 text-base font-medium"
                onClick={() => navigate(RoutePath.Register)}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/60 text-primary hover:bg-white/15 hover:border-white rounded-lg px-8 h-12 text-base font-medium"
                onClick={() => navigate(RoutePath.Login)}
              >
                Log In
              </Button>
            </div>
          </div>
        </div>

        {/* Expert CTA */}
        <div className="mt-8 bg-stone-900 rounded-xl p-8 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Are you a professional?
            </h3>
            <p className="mt-2 text-stone-400">
              Start teaching and earning by becoming a verified expert.
            </p>
          </div>
          <Button
            size="lg"
            className="mt-6 md:mt-0 bg-accent text-primary hover:bg-accent/90 rounded-lg px-6 h-11 font-medium"
          >
            Apply to become an Expert
          </Button>
        </div>
      </div>
    </section>
  );
};

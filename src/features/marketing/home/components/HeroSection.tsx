import { Button } from "@/shared/components/ui/button";
import { motion } from "motion/react";
import type React from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { RoutePath } from "@/shared/config/routes";

export const HeroSection: React.FC<{
  onLearnMoreButtonClick: () => void;
}> = ({ onLearnMoreButtonClick }) => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,var(--color-accent),transparent_28%)] opacity-25" />

      <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-20 md:py-32">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left — headline copy */}
          <div className="max-w-3xl">
            <motion.div
              className="bg-secondary text-secondary-foreground inline-flex items-center gap-2 rounded-sm px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="bg-live animate-live-pulse inline-flex h-2 w-2 rounded-full" />
              Expert-led live workshops
            </motion.div>

            <motion.h1
              className="mt-6 font-serif text-5xl leading-none text-balance text-foreground md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Learn practical skills in rooms built for completion, not just
              signups.
            </motion.h1>

            <motion.p
              className="text-muted-foreground mt-6 max-w-xl text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Skill Stew pairs verified experts with live cohorts, recorded
              access, and a community layer that keeps momentum between
              sessions.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
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
                onClick={onLearnMoreButtonClick}
              >
                Learn More
              </Button>
            </motion.div>
          </div>

          {/* Right — pull quote */}
          <motion.blockquote
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Decorative opening mark */}
            <span
              className="font-serif text-primary pointer-events-none select-none absolute -top-6 -left-1 text-9xl leading-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>

            <p className="font-serif text-xl text-foreground leading-relaxed pt-10">
              I completed the advanced Python workshop and landed a job as a
              junior developer within 3 months. The expert instructors and
              cohort support made all the difference.
            </p>

            <footer className="mt-8 flex items-center gap-3">
              <div
                className="bg-secondary text-primary h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                aria-hidden="true"
              >
                S
              </div>
              <div>
                <cite className="not-italic font-medium text-foreground text-sm">
                  Sarah M.
                </cite>
                <p className="text-muted-foreground text-sm">
                  Junior Developer
                </p>
              </div>
            </footer>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
};

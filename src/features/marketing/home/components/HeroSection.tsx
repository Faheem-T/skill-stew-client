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
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/30 text-primary text-sm font-medium mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            Learn from verified experts
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Master practical skills with live expert workshops
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="mt-6 text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join live cohorts led by industry experts. Learn effectively with
            community support, flexible schedules, and lifetime access to
            recorded sessions.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-8 h-12 text-base font-medium"
              onClick={() => navigate(RoutePath.Register)}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-primary rounded-lg px-8 h-12 text-base font-medium"
              onClick={onLearnMoreButtonClick}
            >
              Learn More
            </Button>
          </motion.div>

          {/* Stats or social proof */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                89%
              </div>
              <div className="text-sm text-stone-500 mt-1">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                500+
              </div>
              <div className="text-sm text-stone-500 mt-1">
                Expert Instructors
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                2000+
              </div>
              <div className="text-sm text-stone-500 mt-1">
                Active Workshops
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

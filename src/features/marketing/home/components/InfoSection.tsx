import { APP_NAME } from "@/shared/config/constants";
import { forwardRef } from "react";
import { Users, GraduationCap } from "lucide-react";
import type React from "react";

export const InfoSection = forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-primary text-white"
      ref={ref}
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            What is {APP_NAME}?
          </h2>
          <p className="mt-4 text-lg md:text-xl text-white/80 leading-relaxed">
            {APP_NAME} connects learners with{" "}
            <span className="text-accent font-medium">
              verified industry experts
            </span>{" "}
            who lead live, cohort-based workshops. Learn effectively through
            structured content, community support, and flexible schedules that
            fit your life.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <InfoCard
            icon={<GraduationCap className="w-6 h-6" />}
            title="Expert-Led Workshops"
            description="Learn from verified industry professionals. Structured curriculum, live Q&A sessions, and real-time feedback to ensure you master practical skills."
          />
          <InfoCard
            icon={<Users className="w-6 h-6" />}
            title="Community Learning"
            description="Join group chats and forums with your cohort. Share ideas, collaborate on projects, and stay motivated with peers on the same learning journey."
          />
        </div>
      </div>
    </section>
  );
});

const InfoCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-white/10 hover:bg-white/15 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent mb-4">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-white/70 leading-relaxed">{description}</p>
    </div>
  );
};

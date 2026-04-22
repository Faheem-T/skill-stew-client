import { APP_NAME } from "@/shared/config/constants";
import { forwardRef } from "react";
import { Users, GraduationCap } from "lucide-react";
import type React from "react";

export const InfoSection = forwardRef<HTMLDivElement, unknown>(
  (_props, ref) => {
    return (
      <section
        id="about"
        className="bg-card py-24 md:py-32"
        ref={ref}
      >
        <div className="mx-auto max-w-[1200px] px-4 md:px-20">
          <div className="max-w-3xl">
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
              About the platform
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground md:text-5xl">
              What is {APP_NAME}?
            </h2>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed md:text-xl">
              {APP_NAME} connects learners with{" "}
              <span className="text-foreground font-medium">
                verified industry experts
              </span>{" "}
              who lead live, cohort-based workshops. Learn effectively through
              structured content, community support, and flexible schedules that
              fit your life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <InfoCard
              icon={<GraduationCap className="h-5 w-5" strokeWidth={1.5} />}
              title="Expert-Led Workshops"
              description="Learn from verified industry professionals. Structured curriculum, live Q&A sessions, and real-time feedback to ensure you master practical skills."
            />
            <InfoCard
              icon={<Users className="h-5 w-5" strokeWidth={1.5} />}
              title="Community Learning"
              description="Join group chats and forums with your cohort. Share ideas, collaborate on projects, and stay motivated with peers on the same learning journey."
            />
          </div>
        </div>
      </section>
    );
  },
);

const InfoCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-background border-border rounded-lg border p-6 md:p-8">
      <div className="bg-secondary text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground md:text-2xl">{title}</h3>
      <p className="text-muted-foreground mt-3 leading-relaxed">{description}</p>
    </div>
  );
};

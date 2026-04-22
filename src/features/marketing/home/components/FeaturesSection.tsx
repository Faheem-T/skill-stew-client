import type React from "react";
import {
  Video,
  MessageSquare,
  Calendar,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

const showcaseFeatures = [
  {
    badge: "Core experience",
    icon: <Video className="h-5 w-5" strokeWidth={1.5} />,
    title: "Live Expert Sessions",
    description:
      "Attend interactive live workshops led by verified industry professionals. Ask questions in real-time, get direct feedback on your work, and learn alongside a cohort of peers on the same path.",
  },
  {
    badge: "Trust layer",
    icon: <Shield className="h-5 w-5" strokeWidth={1.5} />,
    title: "Verified Instructors",
    description:
      "Every expert is verified through document submission and credential validation before leading a workshop. You'll always know who is teaching you and why they are qualified to do it.",
  },
];

const supportingFeatures = [
  {
    icon: <Calendar className="h-5 w-5" strokeWidth={1.5} />,
    title: "Flexible Cohorts",
    description:
      "Choose a schedule that fits your life. Each cohort runs on its own timeline with a dedicated expert.",
  },
  {
    icon: <MessageSquare className="h-5 w-5" strokeWidth={1.5} />,
    title: "Community Forums",
    description:
      "Group chats and forums per cohort keep you connected with peers and the instructor between sessions.",
  },
  {
    icon: <Zap className="h-5 w-5" strokeWidth={1.5} />,
    title: "Lifetime Access",
    description:
      "Miss a session? Every workshop is recorded. Access replays forever at no extra cost.",
  },
  {
    icon: <Globe className="h-5 w-5" strokeWidth={1.5} />,
    title: "Global Expertise",
    description:
      "Browse workshops across any subject, led by experts from around the world.",
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-20">
        {/* Section header — left-aligned */}
        <div className="mb-16 max-w-2xl">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
            Why it works
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Why expert-led workshops work better
          </h2>
        </div>

        {/* Showcase tier — asymmetric 2-col panels */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Primary showcase — bordered card */}
          <div className="bg-card border-border rounded-lg border p-8 md:p-10">
            <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
              {showcaseFeatures[0].badge}
            </span>
            <div className="bg-secondary text-primary mt-4 flex h-12 w-12 items-center justify-center rounded-lg">
              {showcaseFeatures[0].icon}
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-foreground md:text-3xl">
              {showcaseFeatures[0].title}
            </h3>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {showcaseFeatures[0].description}
            </p>
          </div>

          {/* Secondary showcase — filled secondary surface, no border */}
          <div className="bg-secondary rounded-lg p-8 md:p-10">
            <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
              {showcaseFeatures[1].badge}
            </span>
            <div className="bg-background text-primary mt-4 flex h-12 w-12 items-center justify-center rounded-lg">
              {showcaseFeatures[1].icon}
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-foreground md:text-3xl">
              {showcaseFeatures[1].title}
            </h3>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {showcaseFeatures[1].description}
            </p>
          </div>
        </div>

        {/* Supporting tier — borderless 4-col list, no cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {supportingFeatures.map((feature) => (
            <div key={feature.title}>
              <div className="text-primary mb-3">{feature.icon}</div>
              <h3 className="text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import type React from "react";
import {
  Video,
  MessageSquare,
  Calendar,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: <Video className="w-5 h-5" />,
    title: "Live Expert Sessions",
    description:
      "Attend interactive live workshops led by industry professionals with real-time Q&A and feedback.",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Flexible Cohorts",
    description:
      "Choose workshops that match your schedule. Each cohort has dedicated start times and instructor.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Verified Instructors",
    description:
      "All experts are thoroughly verified through document submission and credential validation.",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Community Forums",
    description:
      "Connect with cohort peers through group chats and forums. Share ideas and stay motivated together.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Lifetime Access",
    description:
      "Miss a live session? Access recorded workshops anytime for lifetime reference and review.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Global Expertise",
    description:
      "Learn from experts around the world in any subject. Unlimited workshop variety and topics.",
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-20">
        <div className="mx-auto mb-16 max-w-2xl">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
            Why it works
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-foreground md:text-4xl">
            Why expert-led workshops work better
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            We've designed every feature to maximize learning effectiveness and
            community engagement.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-card border-border hover:border-primary rounded-lg border p-6 transition-colors">
      <div className="bg-secondary text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

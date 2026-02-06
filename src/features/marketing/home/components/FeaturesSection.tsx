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
      <div className="container mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Why expert-led workshops work better
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            We've designed every feature to maximize learning effectiveness and
            community engagement.
          </p>
        </div>

        {/* Features grid */}
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
    <div className="group p-6 rounded-lg border border-stone-200 bg-white hover:border-primary/30 hover:shadow-sm transition-all">
      <div className="w-10 h-10 rounded-lg bg-accent/40 flex items-center justify-center text-primary mb-4 group-hover:bg-accent/60 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-2 text-stone-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

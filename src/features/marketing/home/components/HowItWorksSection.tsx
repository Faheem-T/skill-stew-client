import type React from "react";

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-stone-100/50">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            How expert workshops work
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            Start learning from experts in just four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 md:gap-4">
          <StepCard
            step="01"
            title="Browse workshops"
            description="Explore expert-led workshops across any topic or skill you want to master."
          />
          <StepCard
            step="02"
            title="Choose your cohort"
            description="Pick a cohort schedule that works for you. Each has its own expert and timeline."
          />
          <StepCard
            step="03"
            title="Join the community"
            description="Connect with peers in forums and group chats. Get feedback and stay motivated."
          />
          <StepCard
            step="04"
            title="Learn & grow!"
            description="Attend live sessions, ask experts in real-time, and access recordings forever."
          />
        </div>

        {/* Expert Workshops highlight */}
        <div className="mt-24 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="aspect-video bg-stone-200 rounded-lg overflow-hidden">
              <img
                src="/expert_workshop.png"
                alt="Expert Workshop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/40 text-primary rounded-full mb-4">
              Proven approach
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
              Cohort-based learning
            </h3>
            <p className="mt-4 text-stone-600 leading-relaxed">
              Learning in cohorts creates accountability and community. You're
              not alone on your journey— you have peers, expert guidance, and
              the flexibility to learn on your own schedule.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-stone-600">
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </span>
                Structured curriculum from experts
              </li>
              <li className="flex items-center gap-3 text-stone-600">
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </span>
                Real-time Q&A and feedback
              </li>
              <li className="flex items-center gap-3 text-stone-600">
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </span>
                Lifetime access to recordings
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const StepCard: React.FC<{
  step: string;
  title: string;
  description: string;
}> = ({ step, title, description }) => {
  return (
    <div className="relative text-center md:text-left">
      {/* Step number */}
      <div className="text-5xl md:text-6xl font-bold text-primary/10 mb-2">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-2 text-sm text-stone-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

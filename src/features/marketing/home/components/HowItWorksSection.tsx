import type React from "react";

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="bg-card py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-20">
        <div className="mx-auto mb-16 max-w-2xl">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-foreground md:text-4xl">
            How expert workshops work
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
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
            <div className="bg-secondary aspect-video overflow-hidden rounded-lg">
              <img
                src="/expert_workshop.png"
                alt="Expert Workshop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="bg-secondary text-secondary-foreground mb-4 inline-block rounded-sm px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em]">
              Proven approach
            </span>
            <h3 className="text-2xl font-semibold text-foreground md:text-3xl">
              Cohort-based learning
            </h3>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Learning in cohorts creates accountability and community. You're
              not alone on your journey— you have peers, expert guidance, and
              the flexibility to learn on your own schedule.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="text-muted-foreground flex items-center gap-3">
                <span className="bg-secondary flex h-5 w-5 items-center justify-center rounded-full">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </span>
                Structured curriculum from experts
              </li>
              <li className="text-muted-foreground flex items-center gap-3">
                <span className="bg-secondary flex h-5 w-5 items-center justify-center rounded-full">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </span>
                Real-time Q&A and feedback
              </li>
              <li className="text-muted-foreground flex items-center gap-3">
                <span className="bg-secondary flex h-5 w-5 items-center justify-center rounded-full">
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
    <div className="relative md:text-left">
      <div className="text-primary/15 mb-2 text-5xl font-semibold md:text-6xl">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

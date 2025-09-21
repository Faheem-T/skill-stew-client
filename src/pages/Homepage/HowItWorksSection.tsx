import type React from "react";

export const HowItWorksSection: React.FC = () => {
  return (
    <div className="py-24 container mx-auto px-4">
      <div className="text-4xl md:text-5xl font-semibold">
        How do Skill Exchanges work?
      </div>
      <div className="flex flex-row gap-0 flex-wrap justify-center items-center p-4 mt-8">
        <CircleCard circleContent="1" mainText="Create your profile">
          List out the skills that you want to learn and the skills that you can
          teach others
        </CircleCard>
        <CircleCard circleContent="2" mainText="Connect">
          Connect with users that have the skills relevant to you
        </CircleCard>
        <CircleCard circleContent="3" mainText="Schedule">
          Schedule skill exchange sessions: one-off or recurring
        </CircleCard>
        <CircleCard circleContent="4" mainText="Learn!">
          Attend exchange sessions and start learning!
        </CircleCard>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-24 items-start justify-start">
        <div className="flex-1">
          <img src="/expert_workshop.png" className="w-full rounded-2xl" />
        </div>
        <div className="flex-1 px-8">
          <div className="text-4xl md:text-5xl font-semibold text-primary">
            Expert Workshops
          </div>
          <div className="text-xl mt-8">
            Take your skills to the next level with Expert led Workshops on
            various topics from languages to technical skills
          </div>
        </div>
      </div>
    </div>
  );
};

const CircleCard: React.FC<{
  circleContent: string;
  mainText: string;
  children: React.ReactNode;
}> = ({ circleContent, mainText, children }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-72 text-center">
      <div className="size-16 rounded-[50%] bg-accent flex justify-center items-center">
        {circleContent}
      </div>
      <div className="text-xl md:text-2xl font-medium">{mainText}</div>
      <div className="text-sm w-1/2">{children}</div>
    </div>
  );
};

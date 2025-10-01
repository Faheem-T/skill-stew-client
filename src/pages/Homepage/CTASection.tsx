import { Button } from "@/components/ui/button";
import type React from "react";
import { useNavigate } from "react-router";

export const CTASection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-primary text-background min-h-[24rem] flex items-center justify-center flex-col gap-8">
        <div className="font-semibold text-center text-5xl">
          Ready to start learning?
        </div>
        <div className="font-medium text-center text-xl">
          Join our community of learners and teachers. Your next skill is just a
          click away
        </div>
        <Button
          variant="secondary"
          size="lg"
          className="font-semibold text-xl"
          onClick={() => {
            navigate("/login");
          }}
        >
          Join Now
        </Button>
      </div>
      <div className="bg-background text-foreground min-h-[24rem] flex items-center justify-center flex-col gap-8 dark">
        <div className="font-medium text-center text-5xl">
          Are you a Professional?
        </div>
        <div className="font-medium text-center text-xl">
          Start teaching and earning by becoming a verified expert
        </div>
        <Button variant="secondary" size="lg" className="font-semibold text-xl">
          Apply to become a verified Expert
        </Button>
      </div>
    </>
  );
};

import type React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  {
    message:
      "I completed the advanced Python workshop and landed a job as a junior developer within 3 months. The expert instructors and cohort support made all the difference.",
    name: "Sarah M.",
    role: "Junior Developer",
  },
  {
    message:
      "The UX design cohort was incredible. I learned practical skills in 8 weeks and immediately started freelancing. Worth every penny.",
    name: "Marcus T.",
    role: "Freelance UX Designer",
  },
  {
    message:
      "Taking the data analytics workshop transformed my career. The live sessions, community forums, and lifetime access to recordings ensured I mastered the material.",
    name: "Priya K.",
    role: "Data Analyst",
  },
  {
    message:
      "As someone switching careers, this platform gave me confidence. The verified instructors were patient, and my cohort became lifelong peers. Highly recommend.",
    name: "James W.",
    role: "Content Strategist",
  },
  {
    message:
      "The Machine Learning workshop prepared me perfectly for interviews. I got hired at my dream company 4 months after completion. Game-changing platform.",
    name: "Alex N.",
    role: "ML Engineer",
  },
];

export const ReviewsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section id="reviews" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
              Testimonials
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              See what our users have to say
            </h2>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              Skill Stew has helped thousands learn new skills. Read their
              reviews to understand what they love about us.
            </p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={prevReview}
                className="border-border text-muted-foreground hover:border-primary hover:text-foreground flex h-10 w-10 items-center justify-center rounded-md border transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <button
                onClick={nextReview}
                className="border-border text-muted-foreground hover:border-primary hover:text-foreground flex h-10 w-10 items-center justify-center rounded-md border transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="relative">
            <ReviewCard {...reviews[activeIndex]} />

            <div className="flex justify-center mt-6">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className="flex h-11 w-11 items-center justify-center"
                  aria-label={`Go to review ${index + 1}`}
                >
                  <span
                    className={`block h-2 w-2 rounded-full transition-colors ${
                      index === activeIndex ? "bg-primary" : "bg-border"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ReviewCard: React.FC<{
  message: string;
  name: string;
  role: string;
}> = ({ message, name, role }) => {
  return (
    <div className="bg-card border-border relative rounded-lg border p-6 md:p-8">
      <div className="bg-secondary absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-lg">
        <Quote className="text-primary w-4 h-4" strokeWidth={1.5} />
      </div>

      <p className="text-foreground mt-4 text-lg leading-relaxed">"{message}"</p>

      <div className="mt-6 flex items-center gap-3">
        <div className="bg-secondary text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-medium text-foreground">{name}</div>
          <div className="text-muted-foreground text-sm">{role}</div>
        </div>
      </div>
    </div>
  );
};

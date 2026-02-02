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
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left side - Header */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
              See what our users have to say
            </h2>
            <p className="mt-4 text-lg text-stone-600 leading-relaxed">
              Skill Stew has helped thousands learn new skills. Read their
              reviews to understand what they love about us.
            </p>

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={prevReview}
                className="w-10 h-10 rounded-lg border border-stone-300 flex items-center justify-center text-stone-600 hover:border-primary hover:text-primary transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextReview}
                className="w-10 h-10 rounded-lg border border-stone-300 flex items-center justify-center text-stone-600 hover:border-primary hover:text-primary transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right side - Review card */}
          <div className="relative">
            <ReviewCard {...reviews[activeIndex]} />

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeIndex ? "bg-primary" : "bg-stone-300"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
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
    <div className="bg-white border border-stone-200 rounded-lg p-6 md:p-8 relative">
      {/* Quote icon */}
      <div className="absolute -top-4 left-6 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Quote className="w-4 h-4 text-white" />
      </div>

      <p className="text-stone-700 leading-relaxed mt-4 text-lg">"{message}"</p>

      <div className="mt-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/40 flex items-center justify-center text-primary font-semibold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-medium text-stone-900">{name}</div>
          <div className="text-sm text-stone-500">{role}</div>
        </div>
      </div>
    </div>
  );
};

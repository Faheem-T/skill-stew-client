import type React from "react";
import { useEffect, useState } from "react";

const reviews = [
  {
    message:
      "Skill Stew is amazing! I was able to exchange my graphic design skills for coding lessons, and the live workshops really helped me level up quickly.",
    name: "Ayesha R.",
    email: "ayesha.r@example.com",
  },
  {
    message:
      "I love how Skill Stew connects people with skills they want to learn. The live expert sessions are a game-changer for deepening knowledge in a practical way.",
    name: "Rahul M.",
    email: "rahul.m@example.com",
  },
  {
    message:
      "This platform made learning fun and social. I swapped my piano skills for photography lessons, and the expert-led workshops gave me insights I couldn't get elsewhere.",
    name: "Fatima S.",
    email: "fatima.s@example.com",
  },
  {
    message:
      "Skill Stew is perfect for anyone looking to grow their abilities. The skill exchange community is vibrant, and the workshops are top-notch!",
    name: "Karan P.",
    email: "karan.p@example.com",
  },
  {
    message:
      "I finally learned cooking techniques from experts while teaching my coding skills to others. Skill Stew's live workshops made the learning process interactive and effective.",
    name: "Leena T.",
    email: "leena.t@example.com",
  },
];

export const ReviewsSection: React.FC = () => {
  return (
    <div className="flex justify-between p-4">
      <div>
        <div className="text-4xl md:text-5xl font-bold">
          See what out users have to say
        </div>
        <div>
          Skill stew has helped countless to learn new skills. Read their
          reviews to understand what they love about us.
        </div>
      </div>
      <ReviewCardContainer />
    </div>
  );
};

const ReviewCardContainer: React.FC = () => {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveCard((prev) => (prev + 1) % (reviews.length - 1));
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  });

  const cards = reviews.map(({ message, name, email }) => (
    <ReviewCard message={message} name={name} email={email} />
  ));

  return <div>{cards[activeCard]}</div>;
};

const ReviewCard: React.FC<{
  message: string;
  name: string;
  email: string;
}> = ({ message, name, email }) => {
  return (
    <div>
      <div>{message}</div>
      <div>{name}</div>
      <div>{email}</div>
    </div>
  );
};

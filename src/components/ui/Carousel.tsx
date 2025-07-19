import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
import { AnimatePresence, motion } from "motion/react";

const carouselData = [
  {
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    title: "Learn from Experts",
    description:
      "Get access to curated content from industry leaders and professionals.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    title: "Interactive Lessons",
    description: "Engage with hands-on projects and real-world scenarios.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
    title: "Track Your Progress",
    description:
      "Monitor your learning journey and celebrate your achievements.",
  },
];

export function Carousel() {
  const [active, setActive] = React.useState(0);
  const [direction, setDirection] = React.useState(1); // 1 for next, -1 for prev
  const prevActive = React.useRef(active);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % carouselData.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (prevActive.current !== active) {
      setDirection(
        active > prevActive.current ||
          (active === 0 && prevActive.current === carouselData.length - 1)
          ? 1
          : -1,
      );
      prevActive.current = active;
    }
  }, [active]);

  // Helper to get card index with wrap-around
  const getIndex = (offset: number) =>
    (active + offset + carouselData.length) % carouselData.length;

  return (
    <AnimatePresence initial={false} custom={direction}>
      <div className="relative flex items-center justify-center h-full w-full overflow-hidden">
        {/* Previous Card (faded) */}
        <motion.div className=" z-0 w-1/2 opacity-40 scale-90 transition-all duration-500 flex-none">
          <CarouselCard {...carouselData[getIndex(-1)]} />
        </motion.div>
        <motion.div
          key={active}
          custom={direction}
          //   initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
          //   animate={{ x: 0, opacity: 1 }}
          //   exit={{
          //     x: direction > 0 ? -300 : 300,
          //     opacity: 0,
          //   }}
          //   animate={{ x: `${-1 * 100}%` }}
          //   transition={{ type: "spring", stiffness: 300, damping: 30 }}
          //   transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="z-10 w-1/2 scale-100 flex-none"
        >
          <CarouselCard {...carouselData[active]} active />
        </motion.div>
        {/* Next Card (faded) */}
        <motion.div
          //   exit={{ opacity: 0 }}
          className=" z-0 w-1/2 opacity-40 scale-90 transition-all duration-500 flex-none"
        >
          <CarouselCard {...carouselData[getIndex(1)]} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function CarouselCard({
  image,
  title,
  description,
  active,
}: {
  image: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <Card
      className={`flex flex-col items-center justify-center h-80 shadow-lg ${
        active ? "ring-2 ring-primary" : ""
      }`}
    >
      <CardHeader className="flex flex-col items-center w-full">
        <img
          src={image}
          alt={title}
          className="rounded-xl w-40 h-32 object-cover mb-4"
        />
        <CardTitle className="text-xl text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  );
}

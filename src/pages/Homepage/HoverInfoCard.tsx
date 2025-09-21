import { motion } from "motion/react";
import type { Variants } from "motion/react";

const containerVariants: Variants = {
  rest: { flex: 1 },
  hover: { flex: 1 },
};

const subContainerVariants: Variants = {
  rest: { flexDirection: "column" },
  hover: {
    flexDirection: "row",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const emojiVariants: Variants = {
  rest: {
    fontSize: "8rem",
  },
  hover: {
    fontSize: "1.5rem",
    // transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const mainTextVariants: Variants = {
  rest: {
    fontSize: "2.25rem",
  },
  hover: {
    fontSize: "1.5rem",
    // transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const childrenVariants: Variants = {
  rest: {
    opacity: 0,
    height: 0,
  },
  hover: { opacity: 1, height: "auto" },
};

export const HoverInfoCard: React.FC<{
  emoji: string;
  mainText: string;
  children: string;
}> = ({ emoji, mainText, children }) => {
  return (
    <motion.div
      layout
      className="bg-accent p-4 text-foreground flex flex-col gap-4 flex-none md:size-72 overflow-scroll"
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
    >
      <motion.div
        layout
        variants={subContainerVariants}
        className="flex text-center"
      >
        <motion.div layout variants={emojiVariants}>
          {emoji}
        </motion.div>
        <motion.div layout variants={mainTextVariants} className="font-medium">
          {mainText}
        </motion.div>
      </motion.div>
      <motion.div variants={childrenVariants}>{children}</motion.div>
    </motion.div>
  );
};

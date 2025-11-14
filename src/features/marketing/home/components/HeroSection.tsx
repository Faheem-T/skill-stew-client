import { Button } from "@/shared/components/ui/button";
import { motion } from "motion/react";
import type React from "react";
import { useNavigate } from "react-router";

export const HeroSection: React.FC<{
  onLearnMoreButtonClick: () => void;
}> = ({ onLearnMoreButtonClick }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center h-full gap-4 p-12 md:p-24">
      <motion.div
        className="font-bold text-5xl md:text-6xl text-primary text-center"
        animate={{ y: "0px" }}
        initial={{ y: "10px" }}
      >
        An innovative approach
      </motion.div>
      <motion.div
        className="font-bold text-5xl md:text-6xl text-center"
        initial={{ y: "10px", visibility: "hidden" }}
        animate={{ y: "0px", filter: "none", visibility: "visible" }}
        transition={{ delay: 0.3 }}
      >
        to acquiring skills!
      </motion.div>
      <motion.div
        className="text-lg md:text-xl w-full md:w-1/2 text-center"
        initial={{ y: "10px", visibility: "hidden" }}
        animate={{ y: "0px", filter: "none", visibility: "visible" }}
        transition={{ delay: 0.6 }}
      >
        Connect with people who have the skills you need, and share your
        expertise in return. Learn, teach, and grow together through video calls
        and chat.
      </motion.div>
      <div className="flex gap-4">
        <motion.span
          initial={{ y: "10px", visibility: "hidden" }}
          animate={{ y: "0px", filter: "none", visibility: "visible" }}
          transition={{ delay: 0.9 }}
        >
          <Button
            onClick={() => {
              navigate("/login");
            }}
          >
            Join now
          </Button>
        </motion.span>
        <motion.span
          initial={{ y: "10px", visibility: "hidden" }}
          animate={{ y: "0px", filter: "none", visibility: "visible" }}
          transition={{ delay: 0.9 }}
        >
          <Button variant="outline" onClick={onLearnMoreButtonClick}>
            Learn more
          </Button>
        </motion.span>
      </div>
    </div>
  );
};

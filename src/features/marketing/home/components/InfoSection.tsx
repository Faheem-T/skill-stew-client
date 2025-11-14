import { APP_NAME } from "@/shared/config/constants";
import { HoverInfoCard } from "./HoverInfoCard";
import { forwardRef } from "react";

export const InfoSection = forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <div className="bg-primary text-background min-h-[70vh] py-8" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="font-semibold text-4xl md:text-5xl p-2">
          What is {APP_NAME}?
        </div>
        <div className="p-4 text-lg md:text-xl">
          {APP_NAME} is a new way to acquire skills through
          <span> Skill Exchanges</span> and <span>Expert Workshops</span>
        </div>
        <div className="flex flex-col md:flex-row p-4 gap-4">
          <HoverInfoCard emoji="💡" mainText="Skill Exchanges">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum
          </HoverInfoCard>
          <HoverInfoCard emoji="🎓" mainText="Expert Workshops">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum
          </HoverInfoCard>
        </div>
      </div>
    </div>
  );
});

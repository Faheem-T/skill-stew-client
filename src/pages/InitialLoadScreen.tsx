import type React from "react";

export const InitialLoadScreen: React.FC = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <img src="/logo.png" className="w-1/3 md:w-1/7 animate-pulseColor" />
    </div>
  );
};

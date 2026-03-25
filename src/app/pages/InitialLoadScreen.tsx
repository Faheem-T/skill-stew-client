import type React from "react";
import { FetchingState } from "@/shared/components/ui/fetching-state";

export const InitialLoadScreen: React.FC = () => {
  return <FetchingState variant="page" />;
};

import { useAppStore } from "@/app/store";
import type React from "react";
import { Navigate } from "react-router";

export const DashboardRoutingPage: React.FC = () => {
  const user = useAppStore((state) => state.user)!;
  return (
    <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace={true} />
  );
};

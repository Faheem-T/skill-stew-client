import { useAppStore } from "@/app/store";
import type React from "react";
import { useNavigate } from "react-router";

export const DashboardRoutingPage: React.FC = () => {
  const user = useAppStore((state) => state.user)!;
  const navigate = useNavigate();
  navigate(`/dashboard/${user.role.toLowerCase()}`, { replace: true });
  return null;
};

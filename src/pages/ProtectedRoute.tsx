import { useAppStore } from "@/store";
import type React from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  roles: string[];
  children?: React.ReactNode | undefined;
}

export const ProtectedRoute = ({ roles, children }: ProtectedRouteProps) => {
  return <>{children}</>;
  const user = useAppStore((state) => state.user);
  if (!user || !roles.includes(user.role)) {
    toast("You do not have permission to access this route");
  }
  return !user || !roles.includes(user.role) ? <Navigate to="/" /> : children;
};

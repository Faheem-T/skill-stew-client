import { useAppStore } from "@/store";
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  roles: string[];
}

export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const user = useAppStore((state) => state.user);
  return !user || !roles.includes(user.role) ? <Navigate to="/" /> : <Outlet />;
};

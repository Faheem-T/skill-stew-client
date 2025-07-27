import { useAppStore } from "@/store";
import type React from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  roles: string[];
}

export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  return (
    <>
      <Outlet />
    </>
  );
  // const user = useAppStore((state) => state.user);
  // if (!user || !roles.includes(user.role)) {
  //   toast("You do not have permission to access this route");
  // }
  // return !user || !roles.includes(user.role) ? <Navigate to="/" /> : <Outlet />;
};

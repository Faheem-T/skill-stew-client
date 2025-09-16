import { useAppStore } from "@/store";
import { Navigate, Outlet } from "react-router";

export const GuestRoute = () => {
  const user = useAppStore((state) => state.user);
  if (user) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" />;
    }
  }
  return user ? <Navigate to="/" /> : <Outlet />;
};

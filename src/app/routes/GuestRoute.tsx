import { Navigate, Outlet } from "react-router";
import { InitialLoadScreen } from "../pages/InitialLoadScreen";
import useCurrentUserProfile from "@/shared/hooks/useCurrentUserProfile";

export const GuestRoute = () => {
  const { data: userProfile, isLoading } = useCurrentUserProfile();

  if (isLoading) {
    return <InitialLoadScreen />;
  }

  if (userProfile) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

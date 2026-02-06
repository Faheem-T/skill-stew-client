import useCurrentUserProfile from "@/shared/hooks/useCurrentUserProfile";
import { Navigate, Outlet } from "react-router";
import { InitialLoadScreen } from "../pages/InitialLoadScreen";
import { RoutePath } from "@/shared/config/routes";

interface ProtectedRouteProps {
  roles: string[];
}

export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const { data: userProfile, isLoading } = useCurrentUserProfile();

  if (isLoading) {
    return <InitialLoadScreen />;
  }

  return !userProfile || !roles.includes(userProfile.role) ? (
    <Navigate to={RoutePath.Home} replace />
  ) : (
    <Outlet />
  );
};

import useCurrentUserProfile from "@/shared/hooks/useCurrentUserProfile";
import type React from "react";
import { Navigate } from "react-router";
import { InitialLoadScreen } from "./InitialLoadScreen";
import { RoutePath } from "@/shared/config/routes";

export const DashboardRoutingPage: React.FC = () => {
  const { data: userProfile, isLoading } = useCurrentUserProfile();

  if (isLoading) {
    return <InitialLoadScreen />;
  }

  if (!userProfile) {
    return <Navigate to={RoutePath.Home} replace />;
  }

  return (
    <Navigate
      to={`${RoutePath.Dashboard}/${userProfile.role.toLowerCase()}`}
      replace
    />
  );
};

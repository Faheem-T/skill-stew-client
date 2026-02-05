import useCurrentUserProfile from "@/shared/hooks/useCurrentUserProfile";
import type React from "react";
import { Navigate } from "react-router";
import { InitialLoadScreen } from "./InitialLoadScreen";

export const DashboardRoutingPage: React.FC = () => {
  const { data: userProfile, isLoading } = useCurrentUserProfile();

  if (isLoading) {
    return <InitialLoadScreen />;
  }

  if (!userProfile) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Navigate
      to={`/dashboard/${userProfile.role.toLowerCase()}`}
      replace={true}
    />
  );
};

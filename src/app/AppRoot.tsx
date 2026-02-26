import { Outlet } from "react-router";
import { useCurrentUserProfile } from "@/shared/hooks/useCurrentUserProfile";
import { InitialLoadScreen } from "./pages/InitialLoadScreen";
import { OnboardingModal } from "@/features/onboarding/components/OnboardingModal";
import { useEffect } from "react";
import { useAppStore } from "./store";
import { SocketProvider } from "@/shared/components/SocketProvider";

export const AppRoot: React.FC = () => {
  const { data: userProfile, isLoading } = useCurrentUserProfile();
  const { isOnboardingModalOpen, setIsOnboardingModalOpen } = useAppStore();

  useEffect(() => {
    if (userProfile?.role === "USER" && !userProfile.isOnboardingComplete) {
      setIsOnboardingModalOpen(true);
    }
  }, [userProfile?.role]);

  if (isLoading) {
    return <InitialLoadScreen />;
  }

  const content = (
    <>
      <Outlet />
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
      />
    </>
  );

  // Only connect to WebSocket when the user is logged in
  if (userProfile) {
    return <SocketProvider>{content}</SocketProvider>;
  }

  return content;
};


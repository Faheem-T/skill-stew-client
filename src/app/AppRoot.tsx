import { Outlet } from "react-router";
import { useCurrentUserProfile } from "@/shared/hooks/useCurrentUserProfile";
import { InitialLoadScreen } from "./pages/InitialLoadScreen";
import { OnboardingModal } from "@/features/onboarding/components/OnboardingModal";
import { useEffect } from "react";
import { useAppStore } from "./store";

export const AppRoot: React.FC = () => {
  const { data: userProfile, isFetching } = useCurrentUserProfile();
  const { isOnboardingModalOpen, setIsOnboardingModalOpen } = useAppStore();

  useEffect(() => {
    if (userProfile?.role === "USER" && userProfile.isOnboardingComplete) {
      setIsOnboardingModalOpen(true);
    }
  }, [userProfile]);

  if (isFetching) {
    return <InitialLoadScreen />;
  }

  return (
    <>
      <Outlet />
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
      />
    </>
  );
};

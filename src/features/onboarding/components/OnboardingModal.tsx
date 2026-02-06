import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useNavigate } from "react-router";
import { Onboarding } from "../pages/onboarding/Onboarding";
import { RoutePath } from "@/shared/config/routes";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleProfileComplete = () => {
    onClose();
    navigate(RoutePath.UserDashboard);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] h-[90vh] sm:max-w-none p-0 border-0 bg-transparent rounded-2xl overflow-hidden">
        <DialogTitle className="sr-only">Complete your profile</DialogTitle>
        <DialogDescription className="sr-only">
          Finish onboarding to personalize your account and access your
          dashboard.
        </DialogDescription>
        <Onboarding onComplete={handleProfileComplete} />
      </DialogContent>
    </Dialog>
  );
};

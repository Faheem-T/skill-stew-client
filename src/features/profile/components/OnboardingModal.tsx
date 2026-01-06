import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useNavigate } from "react-router";
import { Onboarding } from "../pages/onboarding/Onboarding";

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
    navigate("/dashboard/user");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:w-[90%] h-[90%] sm:max-w-full">
        <DialogHeader className="pb-4">
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please fill in your profile information to get started with Skill
            Stew.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-auto">
          <Onboarding onComplete={handleProfileComplete} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

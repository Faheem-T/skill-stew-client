import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
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
      <DialogContent className="w-[90vw] h-[90vh] sm:max-w-none p-0 border-0 bg-transparent rounded-2xl overflow-hidden">
        <Onboarding onComplete={handleProfileComplete} />
      </DialogContent>
    </Dialog>
  );
};

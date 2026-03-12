import { Button } from "@/shared/components/ui/button";
import toast from "react-hot-toast";

export const PlaceholderReviewActions = () => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        onClick={() => {
          toast("Approve not implemented yet");
        }}
      >
        Approve
      </Button>
      <Button
        type="button"
        variant="destructive"
        onClick={() => {
          toast("Reject not implemented yet");
        }}
      >
        Reject
      </Button>
    </div>
  );
};


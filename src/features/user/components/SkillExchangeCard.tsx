import { Clock, MessageCircle, Video, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { cn } from "@/shared/lib/utils";

interface SkillExchangeCardProps {
  title: string;
  teaching: string;
  learning: string;
  time: string;
  avatarSrc?: string;
  avatarFallback: string;
  avatarBgClass: string;
  bgClass: string;
  borderClass: string;
  primaryAction?: "join" | "reschedule" | "confirm";
  onChat?: () => void;
}

export const SkillExchangeCard = ({
  title,
  teaching,
  learning,
  time,
  avatarSrc,
  avatarFallback,
  avatarBgClass,
  bgClass,
  borderClass,
  primaryAction = "join",
  onChat,
}: SkillExchangeCardProps) => {
  const getPrimaryButton = () => {
    switch (primaryAction) {
      case "join":
        return (
          <Button
            size="sm"
            className="bg-accent hover:bg-accent/90 text-background"
          >
            <Video className="w-4 h-4 mr-1" />
            Join
          </Button>
        );
      case "reschedule":
        return (
          <Button
            size="sm"
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary hover:text-background"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Reschedule
          </Button>
        );
      case "confirm":
        return (
          <Button
            size="sm"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-background"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Confirm
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
        bgClass,
        borderClass,
      )}
    >
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={avatarSrc} />
          <AvatarFallback className={avatarBgClass}>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-primary">{title}</h4>
          <p className="text-sm text-text/70">
            Teaching: {teaching} • Learning: {learning}
          </p>
          <div className="flex items-center text-sm text-text/60 mt-1">
            <Clock className="w-4 h-4 mr-1" />
            {time}
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={onChat}>
          <MessageCircle className="w-4 h-4 mr-1" />
          Chat
        </Button>
        {getPrimaryButton()}
      </div>
    </div>
  );
};

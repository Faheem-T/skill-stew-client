import { Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { cn } from "@/shared/lib/utils";

interface PersonCardProps {
  name: string;
  rating: number;
  exchanges: number;
  canTeach: string[];
  wantsToLearn: string[];
  avatarSrc?: string;
  avatarFallback: string;
  avatarBgClass: string;
  bgClass: string;
  borderClass: string;
  buttonVariant?: "accent" | "secondary" | "primary";
  onConnect?: () => void;
}

export const PersonCard = ({
  name,
  rating,
  exchanges,
  canTeach,
  wantsToLearn,
  avatarSrc,
  avatarFallback,
  avatarBgClass,
  bgClass,
  borderClass,
  buttonVariant = "accent",
  onConnect,
}: PersonCardProps) => {
  const getButtonVariant = () => {
    switch (buttonVariant) {
      case "accent":
        return "bg-accent hover:bg-accent/90 text-background";
      case "secondary":
        return "bg-secondary hover:bg-secondary/90 text-background";
      case "primary":
        return "bg-primary hover:bg-primary/90 text-background";
      default:
        return "bg-accent hover:bg-accent/90 text-background";
    }
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all duration-200 hover:shadow-md hover:scale-102",
        bgClass,
        borderClass,
      )}
    >
      <div className="flex items-start space-x-3 mb-3">
        <Avatar>
          <AvatarImage src={avatarSrc} />
          <AvatarFallback className={avatarBgClass}>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-semibold text-primary">{name}</h4>
          <div className="flex items-center text-sm text-text/70 mb-2">
            <Star className="w-4 h-4 text-accent mr-1" />
            {rating} • {exchanges} exchanges
          </div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div>
          <p className="text-sm font-medium text-accent">Can teach:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {canTeach.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-primary">Wants to learn:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {wantsToLearn.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <Button
        size="sm"
        className={cn("w-full", getButtonVariant())}
        onClick={onConnect}
      >
        Connect
      </Button>
    </div>
  );
};

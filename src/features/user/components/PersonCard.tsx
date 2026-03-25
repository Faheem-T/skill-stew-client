import { DefaultAvatarIllustration } from "@/features/onboarding/components/DefaultAvatarIllustration";
import { sendConnectionRequest } from "@/features/user/api/SendConnectionRequest";
import type {
  ApiErrorResponseType,
  ApiResponseWithData,
} from "@/shared/api/baseApi";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { RoutePath } from "@/shared/config/routes";

interface Skill {
  skillId: string;
  skillName: string;
}

interface PersonCardProps {
  id: string;
  name?: string;
  username?: string;
  location?: string;
  avatarUrl?: string;
  offeredSkills?: Skill[];
  wantedSkills?: Skill[];
}

export const PersonCard = ({
  id,
  name,
  username,
  location,
  avatarUrl,
  offeredSkills,
  wantedSkills,
}: PersonCardProps) => {
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess } = useMutation<
    ApiResponseWithData<{ connectionStatus: "PENDING" | "ACCEPTED" }>,
    ApiErrorResponseType,
    { userId: string }
  >({
    mutationFn: sendConnectionRequest,
    onError: (error) => {
      error.response?.data.errors.forEach(({ message }) =>
        toast.error(message),
      );
    },
  });

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutate({ userId: id });
  };

  const handleCardClick = () => {
    navigate(RoutePath.PublicProfile.replace(":id", id));
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-card border-border hover:border-primary rounded-lg border p-4 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="bg-secondary flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <DefaultAvatarIllustration />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-semibold text-foreground">
              {name || username || "User"}
            </p>
            {location && <p className="text-muted-foreground text-sm">{location}</p>}
            {offeredSkills && offeredSkills.length > 0 && (
              <div className="mt-2">
                <p className="text-muted-foreground mb-1 text-xs font-medium">
                  Offers:
                </p>
                <div className="flex flex-wrap gap-1">
                  {offeredSkills.map((skill) => (
                    <span
                      key={skill.skillId}
                      className="bg-secondary text-secondary-foreground rounded-sm px-2 py-1 text-xs"
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {wantedSkills && wantedSkills.length > 0 && (
              <div className="mt-2">
                <p className="text-muted-foreground mb-1 text-xs font-medium">
                  Wants to learn:
                </p>
                <div className="flex flex-wrap gap-1">
                  {wantedSkills.map((skill) => (
                    <span
                      key={skill.skillId}
                      className="bg-accent text-accent-foreground rounded-sm px-2 py-1 text-xs"
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {isSuccess ? (
          <span className="bg-warning-muted text-foreground border-border shrink-0 rounded-md border px-4 py-2 text-sm font-medium">
            Pending
          </span>
        ) : (
          <button
            className="bg-primary text-primary-foreground flex shrink-0 items-center gap-2 rounded-md px-4 py-2 font-medium whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40"
            onClick={handleConnect}
            disabled={isPending}
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Connecting..." : "Connect"}
          </button>
        )}
      </div>
    </div>
  );
};

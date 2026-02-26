import { DefaultAvatarIllustration } from "@/features/onboarding/components/DefaultAvatarIllustration";
import { sendConnectionRequest } from "@/features/user/api/SendConnectionRequest";
import type {
  RecommendedUser,
} from "@/features/user/api/GetRecommendedUsers";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { UserConnectionStatus } from "@/shared/constants/UserConnectionStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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
  connectionStatusToUser: UserConnectionStatus | "NONE";
}

const statusConfig: Record<
  UserConnectionStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  },
  ACCEPTED: {
    label: "Connected",
    className: "bg-green-100 text-green-800 border border-green-300",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-stone-100 text-stone-500 border border-stone-300",
  },
};

export const PersonCard = ({
  id,
  name,
  username,
  location,
  avatarUrl,
  offeredSkills,
  wantedSkills,
  connectionStatusToUser,
}: PersonCardProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: sendConnectionRequest,
    onSuccess: () => {
      queryClient.setQueryData<ApiResponseWithData<RecommendedUser[]>>(
        ["recommended-users"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((user) =>
              user.id === id
                ? { ...user, connectionStatusToUser: "PENDING" as const }
                : user,
            ),
          };
        },
      );
    },
  });

  const handleConnect = () => {
    mutate({ userId: id });
  };

  const showConnectButton = connectionStatusToUser === "NONE";

  return (
    <div className="p-4 border border-stone-200 rounded-lg hover:border-primary/50 hover:shadow-md transition-all bg-white">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-accent/20 flex items-center justify-center">
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
            <p className="font-semibold text-stone-900 truncate">
              {name || username || "User"}
            </p>
            {location && <p className="text-sm text-stone-500">{location}</p>}
            {offeredSkills && offeredSkills.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-stone-600 mb-1">
                  Offers:
                </p>
                <div className="flex flex-wrap gap-1">
                  {offeredSkills.map((skill) => (
                    <span
                      key={skill.skillId}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {wantedSkills && wantedSkills.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-stone-600 mb-1">
                  Wants to learn:
                </p>
                <div className="flex flex-wrap gap-1">
                  {wantedSkills.map((skill) => (
                    <span
                      key={skill.skillId}
                      className="text-xs bg-accent/30 text-stone-700 px-2 py-1 rounded"
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {showConnectButton ? (
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shrink-0 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleConnect}
            disabled={isPending}
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Connecting..." : "Connect"}
          </button>
        ) : (
          <span
            className={`px-4 py-2 rounded-lg text-sm font-medium shrink-0 ${statusConfig[connectionStatusToUser].className}`}
          >
            {statusConfig[connectionStatusToUser].label}
          </span>
        )}
      </div>
    </div>
  );
};

import { DefaultAvatarIllustration } from "@/features/onboarding/components/DefaultAvatarIllustration";

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
  onConnect?: () => void;
}

export const PersonCard = ({
  name,
  username,
  location,
  avatarUrl,
  offeredSkills,
  wantedSkills,
  onConnect,
}: PersonCardProps) => {
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
        <button
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shrink-0 whitespace-nowrap"
          onClick={onConnect}
        >
          Connect
        </button>
      </div>
    </div>
  );
};

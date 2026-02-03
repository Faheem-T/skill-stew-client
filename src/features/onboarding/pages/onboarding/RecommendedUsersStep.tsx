import { useQuery } from "@tanstack/react-query";
import { getRecommendedUsersRequest } from "@/features/user/api/GetRecommendedUsers";
import { Button } from "@/shared/components/ui/button";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { DefaultAvatarIllustration } from "@/features/onboarding/components/DefaultAvatarIllustration";

interface RecommendedUsersStepProps {
  onComplete: () => void;
}

export const RecommendedUsersStep: React.FC<RecommendedUsersStepProps> = ({
  onComplete,
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recommended-users"],
    queryFn: getRecommendedUsersRequest,
  });

  const users = data?.data || [];

  return (
    <div className="flex flex-col items-center justify-start py-12 px-8 h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
          People You Might Be Interested In
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Failed to load recommendations</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No users found yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-slate-200 rounded-lg hover:border-primary/50 hover:shadow-md transition-all bg-white"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-accent/20 flex items-center justify-center">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <DefaultAvatarIllustration />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {user.name || user.username || "User"}
                      </p>
                      {user.location && (
                        <p className="text-sm text-slate-500">
                          {user.location}
                        </p>
                      )}
                      {user.offeredSkills && user.offeredSkills.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-slate-600 mb-1">
                            Offers:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {user.offeredSkills.map((skill) => (
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
                      {user.wantedSkills && user.wantedSkills.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-slate-600 mb-1">
                            Wants to learn:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {user.wantedSkills.map((skill) => (
                              <span
                                key={skill.skillId}
                                className="text-xs bg-accent/30 text-slate-700 px-2 py-1 rounded"
                              >
                                {skill.skillName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shrink-0 whitespace-nowrap">
                    Connect
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-12 justify-center">
          <Button
            onClick={onComplete}
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
          >
            Done
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

import { useQuery } from "@tanstack/react-query";
import { getRecommendedUsersRequest } from "@/features/user/api/GetRecommendedUsers";
import { PersonCard } from "@/features/user/components/PersonCard";
import { Button } from "@/shared/components/ui/button";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface RecommendedUsersStepProps {
  onComplete: () => void;
}

export const RecommendedUsersStep: React.FC<RecommendedUsersStepProps> = ({
  onComplete,
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recommended-users"],
    queryFn: getRecommendedUsersRequest,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
              >
                <PersonCard
                  id={user.id}
                  name={user.name}
                  username={user.username}
                  location={user.location}
                  avatarUrl={user.avatarUrl}
                  offeredSkills={user.offeredSkills}
                  wantedSkills={user.wantedSkills}
                />
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

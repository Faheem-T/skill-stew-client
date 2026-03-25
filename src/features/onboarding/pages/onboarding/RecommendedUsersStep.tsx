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
    <div className="flex h-full flex-col items-center justify-start overflow-y-auto px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <h2 className="mb-8 text-2xl font-semibold text-foreground">
          People You Might Be Interested In
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-primary h-8 w-8 animate-spin" strokeWidth={1.5} />
          </div>
        ) : error ? (
          <div className="py-12">
            <p className="text-muted-foreground">Failed to load recommendations</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12">
            <p className="text-muted-foreground">No users found yet</p>
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

        <div className="mt-12 flex gap-4">
          <Button onClick={onComplete} className="px-8">
            Done
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

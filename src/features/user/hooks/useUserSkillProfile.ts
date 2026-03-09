import { useQuery } from "@tanstack/react-query";
import { getUserSkillProfile } from "../api/GetUserSkillProfile";

export const USER_SKILL_PROFILE_QUERY_KEY = ["user-skill-profile"] as const;

export const useUserSkillProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: [...USER_SKILL_PROFILE_QUERY_KEY, userId],
    queryFn: () => getUserSkillProfile({ userId: userId! }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

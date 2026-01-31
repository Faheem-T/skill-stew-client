import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";
import { getCurrentUserSkillProfile } from "@/shared/api/currentUserSkillProfile";
import { updateUserSkillProfileRequest } from "@/features/profile/api/UpdateUserSkillProfile";

export const CURRENT_USER_SKILL_PROFILE_QUERY_KEY = [
  "currentUserSkillProfile",
] as const;

// Using the type from the API directly to avoid type conflicts
type CurrentUserSkillProfile = Awaited<
  ReturnType<typeof getCurrentUserSkillProfile>
>["data"];

interface UpdateUserSkillProfileRequestData {
  offered: {
    skillId: string;
    skillName: string;
    proficiency: string;
  }[];
  wanted: { skillId: string; skillName: string }[];
}

export function useCurrentUserSkillProfile(
  options?: UseQueryOptions<
    CurrentUserSkillProfile | undefined,
    ApiErrorResponseType
  >,
) {
  return useQuery<CurrentUserSkillProfile | undefined, ApiErrorResponseType>({
    queryKey: CURRENT_USER_SKILL_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await getCurrentUserSkillProfile();
      return res.data as CurrentUserSkillProfile;
    },
    staleTime: Infinity,
    ...options,
  });
}

export function useUpdateUserSkillProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserSkillProfileRequestData) => {
      return await updateUserSkillProfileRequest(data as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CURRENT_USER_SKILL_PROFILE_QUERY_KEY,
      });
    },
  });
}

export default useCurrentUserSkillProfile;

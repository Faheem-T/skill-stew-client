import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";
import type { CurrentUserProfile } from "@/shared/api/currentUserProfile";
import { getCurrentUserProfile } from "@/shared/api/currentUserProfile";

// DO NOT USE THIS HOOK DIRECTLY
// USE ROLE SPECIFIC WRAPPERS INSTEAD (e.g. useUserProfile)

export const CURRENT_USER_PROFILE_QUERY_KEY = ["currentUserProfile"] as const;

export function useCurrentUserProfile(
  options?: UseQueryOptions<
    CurrentUserProfile | undefined,
    ApiErrorResponseType
  >,
) {
  return useQuery<CurrentUserProfile | undefined, ApiErrorResponseType>({
    queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await getCurrentUserProfile();
      return res.data;
    },
    staleTime: Infinity,
    ...options,
  });
}

export default useCurrentUserProfile;

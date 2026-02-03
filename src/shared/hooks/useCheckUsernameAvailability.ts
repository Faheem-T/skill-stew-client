import { useQuery } from "@tanstack/react-query";
import { checkUsernameAvailabilityRequest } from "@/features/onboarding/api/CheckUsernameAvailability";

export const useCheckUsernameAvailability = (
  username: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["check-username-availability", username],
    queryFn: () => checkUsernameAvailabilityRequest(username),
    enabled: enabled && !!username && username.length >= 3,
    retry: false,
    staleTime: 0,
  });
};

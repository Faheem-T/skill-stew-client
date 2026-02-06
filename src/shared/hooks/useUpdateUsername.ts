import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUsernameRequest } from "@/shared/api/UpdateUsername";
import { CURRENT_USER_PROFILE_QUERY_KEY } from "@/shared/hooks/useCurrentUserProfile";
import type { CurrentUserProfile } from "@/shared/api/currentUserProfile";

export const useUpdateUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUsernameRequest,
    onSuccess: (_data, newUsername) => {
      // Optimistically update the cache with the new username
      queryClient.setQueryData<CurrentUserProfile | undefined>(
        CURRENT_USER_PROFILE_QUERY_KEY,
        (oldData) => {
          if (!oldData) return oldData;

          // Update username for USER or ADMIN roles
          if (oldData.role === "USER" || oldData.role === "ADMIN") {
            return {
              ...oldData,
              username: newUsername,
            };
          }

          return oldData;
        },
      );
    },
  });
};

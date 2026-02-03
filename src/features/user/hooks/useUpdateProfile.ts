import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfileRequest,
  type UpdateProfileBody,
} from "@/features/user/api/UpdateProfile";
import { CURRENT_USER_PROFILE_QUERY_KEY } from "@/shared/hooks/useCurrentUserProfile";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, UpdateProfileBody>({
    mutationFn: async (body: UpdateProfileBody) => {
      await updateProfileRequest(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
      });
    },
  });
};

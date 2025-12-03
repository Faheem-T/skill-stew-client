import { useMutation } from "@tanstack/react-query";
import {
  updateProfileRequest,
  type UpdateProfileBody,
} from "@/features/profile/api/UpdateProfile";
import { CURRENT_USER_PROFILE_QUERY_KEY } from "@/shared/hooks/useCurrentUserProfile";

export const useUpdateProfile = () => {
  return useMutation<void, unknown, UpdateProfileBody>({
    mutationFn: async (body: UpdateProfileBody) => {
      await updateProfileRequest(body);
    },
    mutationKey: CURRENT_USER_PROFILE_QUERY_KEY,
  });
};

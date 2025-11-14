import { useMutation } from "@tanstack/react-query";
import { updateProfileRequest, type UpdateProfileBody } from "@/features/auth/api/UpdateProfile";

export const useUpdateProfile = () => {
  return useMutation<void, unknown, UpdateProfileBody>({
    mutationFn: async (body: UpdateProfileBody) => {
      await updateProfileRequest(body);
    },
  });
};

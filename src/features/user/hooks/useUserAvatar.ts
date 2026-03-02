import { useQuery } from "@tanstack/react-query";
import {
  getUserAvatarRequest,
  type UserAvatarResponse,
} from "@/features/user/api/GetUserAvatar";
import type {
  ApiErrorResponseType,
  ApiResponseWithData,
} from "@/shared/api/baseApi";

export const useUserAvatar = (userId: string | undefined) => {
  return useQuery<
    ApiResponseWithData<UserAvatarResponse>,
    ApiErrorResponseType
  >({
    queryKey: ["userAvatar", userId],
    queryFn: () => getUserAvatarRequest({ userId: userId! }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // avatars rarely change
  });
};

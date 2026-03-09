import { useQuery } from "@tanstack/react-query";
import {
  getUserProfileRequest,
  type UserProfile,
} from "@/features/user/api/GetUserProfile";
import type {
  ApiErrorResponseType,
  ApiResponseWithData,
} from "@/shared/api/baseApi";

export const usePublicUserProfile = (userId: string) => {
  return useQuery<ApiResponseWithData<UserProfile>, ApiErrorResponseType>({
    queryKey: ["publicUserProfile", userId],
    queryFn: () => getUserProfileRequest({ id: userId }),
    enabled: !!userId,
  });
};

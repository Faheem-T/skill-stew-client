import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";

export interface UserAvatarResponse {
  avatarUrl: string | null;
}

export const getUserAvatarRequest = async ({
  userId,
}: {
  userId: string;
}): Promise<ApiResponseWithData<UserAvatarResponse>> => {
  return api.get(`users/${userId}/avatar`);
};

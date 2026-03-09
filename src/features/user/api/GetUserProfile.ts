import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";

export interface UserProfile {
  userId: string;
  username?: string;
  isVerified: boolean;
  name?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  timezone?: string;
  about?: string;
  socialLinks?: string[];
  languages?: string[];
  location?: string;
}

export const getUserProfileRequest = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponseWithData<UserProfile>> => {
  return api.get(`users/${id}`);
};

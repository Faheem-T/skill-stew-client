import { api } from "@/shared/api/baseApi";
import type { ApiResponseType } from "@/shared/api/baseApi";

export type UpdateProfileBody = {
  name?: string;
  username?: string;
  phoneNumber?: string;
  avatarKey?: string;
  timezone?: string;
  location?: { city?: string; country?: string } | undefined;
  about?: string;
  socialLinks?: string[];
  languages?: string[];
};

export const updateProfileRequest = async (
  body: UpdateProfileBody,
): Promise<ApiResponseType> => {
  return api.patch("/users/profile", body);
};

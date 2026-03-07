import { api } from "@/shared/api/baseApi";
import type { ApiResponseType } from "@/shared/api/baseApi";

export type UpdateProfileBody = {
  name?: string;
  phoneNumber?: string;
  avatarKey?: string;
  bannerKey?: string;
  timezone?: string;
  location?: { latitude: number; longitude: number; formattedAddress: string };
  about?: string;
  socialLinks?: string[];
  languages?: string[];
};

export const updateProfileRequest = async (
  body: UpdateProfileBody,
): Promise<ApiResponseType> => {
  return api.patch("/me", body);
};

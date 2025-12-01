import type { ApiResponseWithData } from "@/shared/api/baseApi";
import { api } from "@/shared/api/baseApi";

export type CurrentUserLocation = {
  latitude: number;
  longitude: number;
  placeId: string;
  formattedAddress: string;
};

export type CurrentUserProfile = {
  name?: string;
  username?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  timezone?: string;
  location?: CurrentUserLocation;
  about?: string;
  socialLinks: string[];
  languages: string[];
};

export async function getCurrentUserProfile(): Promise<
  ApiResponseWithData<CurrentUserProfile>
> {
  return api.get("/me");
}

export default getCurrentUserProfile;

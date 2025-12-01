import type { ApiResponseWithData } from "@/shared/api/baseApi";
import { api } from "@/shared/api/baseApi";

export type CurrentUserLocation = {
  latitude: number;
  longitude: number;
  placeId: string;
  formattedAddress: string;
};

export type CurrentUserProfile =
  | {
      email: string;
      role: "USER";
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
    }
  | {
      role: "EXPERT";
      email: string;
    }
  | {
      role: "ADMIN";
      username: string;
    };

export async function getCurrentUserProfile(): Promise<
  ApiResponseWithData<CurrentUserProfile>
> {
  return api.get("/me");
}

export default getCurrentUserProfile;

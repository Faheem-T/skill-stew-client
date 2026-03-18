import type { ApiResponseWithData } from "@/shared/api/baseApi";
import { api } from "@/shared/api/baseApi";

export type CurrentUserLocation = {
  latitude: number;
  longitude: number;
  formattedAddress: string;
};

export type CurrentUserProfile =
  | {
      id: string;
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
      isOnboardingComplete: boolean;
    }
  | {
      id: string;
      role: "EXPERT";
      email: string;
    }
  | {
      id: string;
      role: "ADMIN";
      email: string;
      username?: string;
      avatarUrl?: string;
    }
  | {
      id: string;
      role: "EXPERT_APPLICANT";
      email: string;
      applicationStatus: "NOT_DONE" | "VERIFICATION_PENDING" | "REJECTED";
    };

export async function getCurrentUserProfile(): Promise<
  ApiResponseWithData<CurrentUserProfile>
> {
  return api.get("/me");
}

export default getCurrentUserProfile;

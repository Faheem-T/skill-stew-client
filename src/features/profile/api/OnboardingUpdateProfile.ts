import { api } from "@/shared/api/baseApi";
import type { ApiResponseType } from "@/shared/api/baseApi";

export type OnboardingUpdateProfileBody = {
  name?: string;
  username?: string;
  avatarKey?: string;
  location?: { placeId: string };
  languages?: string[];
};

export const onboardingUpdateProfileRequest = async (
  body: OnboardingUpdateProfileBody,
): Promise<ApiResponseType> => {
  return api.patch("/users/onboarding/profile", body);
};

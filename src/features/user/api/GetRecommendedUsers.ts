import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";

export type RecommendedUser = {
  id: string;
  name?: string;
  username?: string;
  location?: string;
  languages?: string[];
  offeredSkills?: { skillId: string; skillName: string }[];
  wantedSkills?: { skillId: string; skillName: string }[];
  avatarUrl?: string;
};

export const getRecommendedUsersRequest = async (): Promise<
  ApiResponseWithData<RecommendedUser[]>
> => {
  return api.get("search/users/recommended");
};

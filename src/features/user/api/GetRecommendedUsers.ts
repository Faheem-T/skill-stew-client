import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { UserConnectionStatus } from "@/shared/constants/UserConnectionStatus";

export type RecommendedUser = {
  id: string;
  name?: string;
  username?: string;
  location?: string;
  languages?: string[];
  offeredSkills?: { skillId: string; skillName: string }[];
  wantedSkills?: { skillId: string; skillName: string }[];
  avatarUrl?: string;
  connectionStatusToUser: UserConnectionStatus | "NONE";
};

export const getRecommendedUsersRequest = async (): Promise<
  ApiResponseWithData<RecommendedUser[]>
> => {
  return api.get("search/users/recommended");
};

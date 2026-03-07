import type { SkillProficiencies } from "@/shared/constants/SkillProficiencies";
import { api, type ApiResponseWithData } from "../../../shared/api/baseApi";

interface GetUserSkillProfileResponse {
  offered: {
    skill: { id: string; name: string };
    proficiency: SkillProficiencies;
    hoursTaught: number;
  }[];
  wanted: { skill: { id: string; name: string }; hoursLearned: number }[];
}

export async function getUserSkillProfile({
  userId,
}: {
  userId: string;
}): Promise<ApiResponseWithData<GetUserSkillProfileResponse>> {
  return api.get(`/skills/profile/${userId}`);
}

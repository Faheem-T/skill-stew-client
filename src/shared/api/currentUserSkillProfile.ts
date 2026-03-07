import type { SkillProficiencies } from "../constants/SkillProficiencies";
import { api, type ApiResponseWithData } from "./baseApi";

interface CurrentUserSkillProfile {
  offered: {
    skill: { id: string; name: string };
    proficiency: SkillProficiencies;
    hoursTaught: number;
  }[];
  wanted: { skill: { id: string; name: string }; hoursLearned: number }[];
}

export async function getCurrentUserSkillProfile(): Promise<
  ApiResponseWithData<CurrentUserSkillProfile>
> {
  return api.get("/skills/profile/me");
}

export default getCurrentUserSkillProfile;

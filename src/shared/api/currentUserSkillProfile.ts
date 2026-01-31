import { api, type ApiResponseWithData } from "./baseApi";

const skillProficiencies = [
  "Beginner",
  "Advanced Beginner",
  "Intermediate",
  "Proficient",
  "Expert",
] as const;

interface CurrentUserSkillProfile {
  offered: {
    skill: { id: string; name: string };
    proficiency: typeof skillProficiencies;
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

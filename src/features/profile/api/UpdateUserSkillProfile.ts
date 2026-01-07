import { api } from "@/shared/api/baseApi";

export const updateUserSkillProfileRequest = async (
  data: UpdateUserSkillProfileRequestData,
) => {
  return api.put("/skills/profile", data);
};

export const skillProficiencies = [
  "Beginner",
  "Advanced Beginner",
  "Intermediate",
  "Proficient",
  "Expert",
] as const;

interface UpdateUserSkillProfileRequestData {
  offered: {
    skillId: string;
    proficiency: (typeof skillProficiencies)[number];
  }[];
  wanted: { skillId: string }[];
}

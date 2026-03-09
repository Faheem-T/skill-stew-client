export const SkillProficiencies = [
  "Beginner",
  "Advanced Beginner",
  "Intermediate",
  "Proficient",
  "Expert",
] as const;

export type SkillProficiencies = (typeof SkillProficiencies)[number];

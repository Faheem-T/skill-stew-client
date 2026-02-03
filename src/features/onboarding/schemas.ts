import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  username: z
    .string()
    .min(5)
    .max(20)
    .regex(/^[a-zA-Z0-9._]+$/, "Only letters, numbers, . and _ allowed")
    .refine((v) => !v.startsWith(".") && !v.startsWith("_"), {
      message: "Username cannot start with '.' or '_'",
    })
    .refine((v) => !v.endsWith(".") && !v.endsWith("_"), {
      message: "Username cannot end with '.' or '_'",
    })
    .refine((v) => !/([._]{2})/.test(v), {
      message: "No consecutive '.' or '_'",
    })
    .optional(),
  location: z.object({ placeId: z.string() }).optional(),
  languages: z.array(z.string()).optional(),
});

export const skillsSchema = z.object({
  offered: z
    .array(
      z.object({
        skillId: z.string().min(1, "Skill ID is required"),
        skillName: z.string().min(1, "Skill name is required"),
        proficiency: z.enum([
          "Beginner",
          "Advanced Beginner",
          "Intermediate",
          "Proficient",
          "Expert",
        ]),
      }),
    )
    .min(1, "At least one offered skill is required"),
  wanted: z
    .array(
      z.object({
        skillId: z.string().min(1, "Skill ID is required"),
        skillName: z.string().min(1, "Skill name is required"),
      }),
    )
    .optional(),
});

export type FormValues = z.infer<typeof profileSchema>;
export type SkillsFormValues = z.infer<typeof skillsSchema>;

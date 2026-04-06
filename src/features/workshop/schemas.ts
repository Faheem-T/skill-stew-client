import z from "zod";

export const workshopBasicsSchema = z.object({
  title: z.string().trim().min(1, "Workshop title is required."),
  description: z.string(),
  targetAudience: z.string(),
  maxCohortSize: z
    .string()
    .trim()
    .min(1, "Maximum cohort size is required.")
    .refine((value) => {
      const numericValue = Number(value);
      return Number.isInteger(numericValue) && numericValue > 0;
    }, "Maximum cohort size must be a positive whole number."),
  bannerImageKey: z.string().nullable(),
});

export type WorkshopBasicsFormValues = z.infer<typeof workshopBasicsSchema>;

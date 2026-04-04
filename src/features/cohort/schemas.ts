import z from "zod";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const cohortFormSchema = z.object({
  startDate: z
    .string()
    .trim()
    .min(1, "Start date is required.")
    .regex(datePattern, "Use the YYYY-MM-DD date format."),
  spotPriceAmount: z
    .string()
    .trim()
    .min(1, "Price is required.")
    .refine((value) => {
      const numericValue = Number(value);
      return Number.isFinite(numericValue) && numericValue >= 0;
    }, "Price must be zero or greater."),
  currency: z
    .string()
    .trim()
    .min(1, "Currency is required.")
    .max(8, "Currency must be short.")
    .transform((value) => value.toUpperCase()),
  maxStudents: z
    .string()
    .trim()
    .min(1, "Maximum seats are required.")
    .refine((value) => {
      const numericValue = Number(value);
      return Number.isInteger(numericValue) && numericValue > 0;
    }, "Maximum seats must be a positive whole number."),
});

export type CohortFormValues = z.input<typeof cohortFormSchema>;

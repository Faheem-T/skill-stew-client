import { z } from "zod";

import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithMessage } from "@/shared/api/baseApi";

export const submitExpertApplicationSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    phone: z.string().min(1, "Phone number is required"),
    socialLinksInput: z
      .string()
      .min(1, "At least one social link is required"),
    yearsExperience: z.coerce
      .number()
      .int("Years of experience must be a whole number")
      .nonnegative("Years of experience cannot be negative"),
    evidenceLinksInput: z
      .string()
      .min(1, "At least one evidence link is required"),
    hasTeachingExperience: z.boolean(),
    teachingExperienceDesc: z.string().optional(),
    bio: z.string().min(1, "Bio is required"),
    proposedTitle: z.string().min(1, "Proposed title is required"),
    proposedDescription: z.string().min(1, "Proposed description is required"),
    targetAudience: z.string().min(1, "Target audience is required"),
    confirmedInternet: z.boolean().refine((value) => value, {
      message: "Internet confirmation is required",
    }),
    confirmedCamera: z.boolean().refine((value) => value, {
      message: "Camera confirmation is required",
    }),
    confirmedMicrophone: z.boolean().refine((value) => value, {
      message: "Microphone confirmation is required",
    }),
    termsAgreed: z.boolean().refine((value) => value, {
      message: "Terms must be agreed to",
    }),
  })
  .superRefine((values, ctx) => {
    const socialLinks = parseSocialLinks(values.socialLinksInput);

    if (socialLinks.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["socialLinksInput"],
        message: "At least one social link is required",
      });
    }

    for (const [index, link] of socialLinks.entries()) {
      const parsed = z.url().safeParse(link);
      if (!parsed.success) {
        ctx.addIssue({
          code: "custom",
          path: ["socialLinksInput"],
          message: `Social link ${index + 1} must be a valid URL`,
        });
        break;
      }
    }

    const evidenceLinks = parseEvidenceLinks(values.evidenceLinksInput);

    if (evidenceLinks.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["evidenceLinksInput"],
        message: "At least one evidence link is required",
      });
    }

    for (const [index, link] of evidenceLinks.entries()) {
      const parsed = z.url().safeParse(link);
      if (!parsed.success) {
        ctx.addIssue({
          code: "custom",
          path: ["evidenceLinksInput"],
          message: `Evidence link ${index + 1} must be a valid URL`,
        });
        break;
      }
    }

    if (
      values.hasTeachingExperience &&
      !values.teachingExperienceDesc?.trim().length
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["teachingExperienceDesc"],
        message: "Describe your teaching experience",
      });
    }
  });

export type SubmitExpertApplicationFormInput = z.input<
  typeof submitExpertApplicationSchema
>;

export type SubmitExpertApplicationFormValues = z.output<
  typeof submitExpertApplicationSchema
>;

export type SubmitExpertApplicationPayload = Omit<
  SubmitExpertApplicationFormValues,
  "evidenceLinksInput" | "socialLinksInput"
> & {
  expertId: string;
  socialLinks: string[];
  evidenceLinks: string[];
};

const parseLinks = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map((link) => link.trim())
    .filter(Boolean);

export const parseEvidenceLinks = parseLinks;
export const parseSocialLinks = parseLinks;

export const toSubmitExpertApplicationPayload = (
  values: SubmitExpertApplicationFormValues,
  expertId: string,
): SubmitExpertApplicationPayload => ({
  expertId,
  fullName: values.fullName.trim(),
  phone: values.phone.trim(),
  socialLinks: parseSocialLinks(values.socialLinksInput),
  yearsExperience: values.yearsExperience,
  evidenceLinks: parseEvidenceLinks(values.evidenceLinksInput),
  hasTeachingExperience: values.hasTeachingExperience,
  teachingExperienceDesc: values.teachingExperienceDesc?.trim() || undefined,
  bio: values.bio.trim(),
  proposedTitle: values.proposedTitle.trim(),
  proposedDescription: values.proposedDescription.trim(),
  targetAudience: values.targetAudience.trim(),
  confirmedInternet: values.confirmedInternet,
  confirmedCamera: values.confirmedCamera,
  confirmedMicrophone: values.confirmedMicrophone,
  termsAgreed: values.termsAgreed,
});

export const submitExpertApplication = async (
  body: SubmitExpertApplicationPayload,
): Promise<ApiResponseWithMessage> => {
  return api.post("/experts/apply", body);
};

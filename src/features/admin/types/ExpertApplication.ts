export const expertApplicationStatuses = [
  "pending",
  "approved",
  "rejected",
] as const;

export type ExpertApplicationStatus =
  (typeof expertApplicationStatuses)[number];

export type ExpertApplicationListItem = {
  id: string;
  expertId: string;
  status: ExpertApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedByAdminId?: string;
  fullName: string;
  phone: string;
  socialLinks: string[];
  yearsExperience: number;
  hasTeachingExperience: boolean;
  proposedTitle: string;
};

export type ExpertApplicationDetails = {
  id: string;
  expertId: string;
  status: ExpertApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedByAdminId?: string;
  rejectionReason?: string;
  fullName: string;
  email: string;
  phone: string;
  socialLinks: string[];
  yearsExperience: number;
  evidenceLinks: string[];
  hasTeachingExperience: boolean;
  teachingExperienceDesc?: string;
  bio: string;
  proposedTitle: string;
  proposedDescription: string;
  targetAudience: string;
  confirmedInternet: boolean;
  confirmedCamera: boolean;
  confirmedMicrophone: boolean;
  termsAgreed: boolean;
  termsAgreedAt: string;
};

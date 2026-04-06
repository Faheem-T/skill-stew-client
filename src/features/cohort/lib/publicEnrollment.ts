import type { CohortEnrollmentStatus } from "@/features/cohort/types/types";

export type PublicEnrollmentState =
  | "enrolled"
  | "payment_needed"
  | "payment_issue"
  | "ended"
  | "reconciliation";

export const getPublicEnrollmentState = (
  status: CohortEnrollmentStatus,
): PublicEnrollmentState => {
  if (status === "active") {
    return "enrolled";
  }

  if (status === "pending_payment") {
    return "payment_needed";
  }

  if (status === "payment_failed") {
    return "payment_issue";
  }

  if (status === "awaiting_reconciliation") {
    return "reconciliation";
  }

  return "ended";
};

export const getEnrollmentStatusLabel = (
  status: CohortEnrollmentStatus,
): string => {
  switch (status) {
    case "pending_payment":
      return "Payment pending";
    case "active":
      return "Enrolled";
    case "payment_failed":
      return "Payment failed";
    case "expired":
      return "Expired";
    case "dropped":
      return "Dropped";
    case "refunded":
      return "Refunded";
    case "awaiting_reconciliation":
      return "Reconciling";
  }
};

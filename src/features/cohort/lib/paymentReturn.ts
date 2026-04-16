import type {
  CohortEnrollmentStatus,
  StripeCheckoutReturnParams,
} from "@/features/cohort/types/types";

type SearchParamsReader = Pick<URLSearchParams, "get">;

export const STRIPE_RETURN_QUERY_PARAM_KEYS = [
  "paymentStatus",
  "paymentId",
  "membershipId",
  "cohortId",
  "workshopId",
  "session_id",
] as const;

const STABLE_ENROLLMENT_STATUSES: CohortEnrollmentStatus[] = [
  "active",
  "payment_failed",
  "expired",
  "dropped",
  "refunded",
];

export const STRIPE_RETURN_POLL_INTERVAL_MS = 3_000;
export const STRIPE_RETURN_POLL_TIMEOUT_MS = 24_000;

export const parseStripeCheckoutReturnParams = (
  searchParams: SearchParamsReader,
  currentCohortId: string,
): StripeCheckoutReturnParams | null => {
  const paymentStatus = searchParams.get("paymentStatus");

  if (paymentStatus !== "success" && paymentStatus !== "cancelled") {
    return null;
  }

  const cohortId = searchParams.get("cohortId");

  if (cohortId && cohortId !== currentCohortId) {
    return null;
  }

  return {
    paymentStatus,
    paymentId: searchParams.get("paymentId"),
    membershipId: searchParams.get("membershipId"),
    cohortId,
    workshopId: searchParams.get("workshopId"),
    sessionId: searchParams.get("session_id"),
  };
};

export const isStableEnrollmentStatus = (
  status: CohortEnrollmentStatus | null | undefined,
): boolean => {
  if (!status) {
    return false;
  }

  return STABLE_ENROLLMENT_STATUSES.includes(status);
};

export const getPaymentReturnPanelCopy = ({
  paymentReturn,
  enrollmentStatus,
  isPolling,
}: {
  paymentReturn: StripeCheckoutReturnParams;
  enrollmentStatus: CohortEnrollmentStatus | null | undefined;
  isPolling: boolean;
}) => {
  if (enrollmentStatus === "active") {
    return {
      title: "Payment confirmed",
      body: "Your seat is active. The latest cohort status is now reflected below.",
      tone: "success" as const,
    };
  }

  if (enrollmentStatus === "payment_failed") {
    return {
      title: "Payment did not complete",
      body: "The backend marked this payment attempt as failed. Review the latest enrollment state below before trying again.",
      tone: "warning" as const,
    };
  }

  if (paymentReturn.paymentStatus === "cancelled") {
    return {
      title: "Checkout was not completed",
      body: "We refreshed the latest enrollment state. If your seat is still pending, you can continue payment from this page.",
      tone: "info" as const,
    };
  }

  if (isPolling) {
    return {
      title: "Confirming payment...",
      body: "Stripe has returned you to the app. We are waiting for the backend webhook flow to update your enrollment.",
      tone: "info" as const,
    };
  }

  return {
    title: "Payment confirmation is still pending",
    body: "The latest backend state is shown below. Your seat can remain in review briefly while payment events finish propagating.",
    tone: "info" as const,
  };
};

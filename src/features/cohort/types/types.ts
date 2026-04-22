export type CohortStatus = "upcoming" | "active" | "completed";

export type CohortEnrollmentStatus =
  | "pending_payment"
  | "active"
  | "payment_failed"
  | "expired"
  | "dropped"
  | "refunded"
  | "awaiting_reconciliation";

export type CohortListItem = {
  id: string;
  workshopId: string;
  workshopTitle: string;
  workshopBannerImageKey: string | null;
  workshopBannerImageUrl: string | null;
  spotPriceAmount: number;
  currency: string;
  startDate: string;
  firstSessionStartsAt: string;
  lastSessionStartsAt: string;
  status: CohortStatus;
  maxStudents: number;
  activeSeats: number;
  heldSeats: number;
  availableSeats: number;
};

export type CohortSession = {
  id: string;
  weekNumber: number;
  dayOfWeek: number;
  sessionOrder: number;
  title?: string | null;
  description?: string | null;
  startTime: string;
  date: string;
  startsAt: string;
};

export type CohortDetails = CohortListItem & {
  expertId: string;
  workshopTimezone: string;
  createdAt: string;
  updatedAt: string;
  sessions: CohortSession[];
};

export type CohortMember = {
  membershipId: string;
  userId: string;
  paymentId: string | null;
  joinedAt: string | null;
};

export type CreateCohortRequest = {
  workshopId: string;
  spotPriceAmount: number;
  currency: string;
  startDate: string;
  maxStudents?: number;
};

export type UpdateCohortRequest = {
  spotPriceAmount?: number;
  currency?: string;
  startDate?: string;
  maxStudents?: number;
};

export type CohortEnrollmentResponse = {
  membershipId: string;
  status: CohortEnrollmentStatus;
  joinedAt: string | null;
  expiresAt: string | null;
  requiresPayment: boolean;
  paymentId: string | null;
  checkoutSessionId: string | null;
  checkoutUrl: string | null;
};

export type StripeCheckoutReturnStatus = "success" | "cancelled";

export type StripeCheckoutReturnParams = {
  paymentStatus: StripeCheckoutReturnStatus;
  paymentId: string | null;
  membershipId: string | null;
  cohortId: string | null;
  workshopId: string | null;
  sessionId: string | null;
};

export type PublicEnrollmentContext = {
  membershipId: string;
  cohortId: string;
  status: CohortEnrollmentStatus;
};

export type PublicCohortSummary = CohortListItem & {
  isEnrollable: boolean;
  myEnrollment: PublicEnrollmentContext | null;
  hasEnrollmentInAnotherCohort: boolean;
};

export type PublicCohortDetails = CohortDetails & {
  isEnrollable: boolean;
  myEnrollment: PublicEnrollmentContext | null;
  hasEnrollmentInAnotherCohort: boolean;
};

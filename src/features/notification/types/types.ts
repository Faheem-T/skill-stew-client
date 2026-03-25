export const NotificationType = {
  CONNECTION_REQUEST: "CONNECTION_REQUEST",
  CONNECTION_ACCEPTED: "CONNECTION_ACCEPTED",
  CONNECTION_REJECTED: "CONNECTION_REJECTED",
  EXPERT_APPLICATION_SUBMITTED: "EXPERT_APPLICATION_SUBMITTED",
  EXPERT_APPLICATION_APPROVED: "EXPERT_APPLICATION_APPROVED",
  EXPERT_APPLICATION_REJECTED: "EXPERT_APPLICATION_REJECTED",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export interface ConnectionRequestData {
  type: typeof NotificationType.CONNECTION_REQUEST;
  senderId: string;
  senderUsername: string | undefined;
  connectionId: string;
}

export interface ConnectionAcceptedData {
  type: typeof NotificationType.CONNECTION_ACCEPTED;
  accepterId: string;
  accepterUsername: string | undefined;
  connectionId: string;
}

export interface ConnectionRejectedData {
  type: typeof NotificationType.CONNECTION_REJECTED;
  rejecterId: string;
  rejecterUsername: string | undefined;
  connectionId: string;
}

export interface ExpertApplicationSubmittedData {
  type: typeof NotificationType.EXPERT_APPLICATION_SUBMITTED;
  applicationId: string;
  expertId: string;
  expertUsername?: string;
  submittedAt: string;
}

export interface ExpertApplicationApprovedData {
  type: typeof NotificationType.EXPERT_APPLICATION_APPROVED;
  approvedAt: string;
}

export interface ExpertApplicationRejectedData {
  type: typeof NotificationType.EXPERT_APPLICATION_REJECTED;
  rejectedAt: string;
  rejectionReason?: string;
}

export type NotificationData =
  | ConnectionRequestData
  | ConnectionAcceptedData
  | ConnectionRejectedData
  | ExpertApplicationSubmittedData
  | ExpertApplicationApprovedData
  | ExpertApplicationRejectedData;

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData;
  isRead: boolean;
  createdAt: string;
}

/**
 * Returns the "other user" ID from a notification's data payload.
 * Useful for fetching avatars or linking to profiles.
 */
export function getNotificationActorId(
  data: NotificationData,
): string | undefined {
  switch (data.type) {
    case NotificationType.CONNECTION_REQUEST:
      return data.senderId;
    case NotificationType.CONNECTION_ACCEPTED:
      return data.accepterId;
    case NotificationType.CONNECTION_REJECTED:
      return data.rejecterId;
    default:
      return undefined;
  }
}

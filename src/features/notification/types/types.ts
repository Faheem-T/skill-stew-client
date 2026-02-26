export const NotificationType = {
  CONNECTION_REQUEST: "CONNECTION_REQUEST",
  CONNECTION_ACCEPTED: "CONNECTION_ACCEPTED",
  CONNECTION_REJECTED: "CONNECTION_REJECTED",
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

export type NotificationData =
  | ConnectionRequestData
  | ConnectionAcceptedData
  | ConnectionRejectedData;

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

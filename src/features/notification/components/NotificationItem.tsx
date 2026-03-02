import type { Notification } from "@/features/notification/types/types";
import {
  NotificationType,
  getNotificationActorId,
} from "@/features/notification/types/types";
import { getNotificationHref } from "@/features/notification/lib/getNotificationHref";
import { useUserAvatar } from "@/features/user/hooks/useUserAvatar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useNavigate } from "react-router";
import { UserPlus, UserCheck, UserX } from "lucide-react";

function getNotificationSubtext(notification: Notification): string {
  switch (notification.data.type) {
    case NotificationType.CONNECTION_REQUEST:
      return `from ${notification.data.senderUsername ?? "a user"}`;
    case NotificationType.CONNECTION_ACCEPTED:
      return `${notification.data.accepterUsername ?? "A user"} accepted`;
    case NotificationType.CONNECTION_REJECTED:
      return `${notification.data.rejecterUsername ?? "A user"} declined`;
    default:
      return "";
  }
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.CONNECTION_REQUEST:
      return <UserPlus className="w-4 h-4 text-blue-600" />;
    case NotificationType.CONNECTION_ACCEPTED:
      return <UserCheck className="w-4 h-4 text-green-600" />;
    case NotificationType.CONNECTION_REJECTED:
      return <UserX className="w-4 h-4 text-stone-500" />;
    default:
      return null;
  }
}

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const navigate = useNavigate();
  const actorId = getNotificationActorId(notification.data);
  const { data: avatarRes } = useUserAvatar(actorId);
  const avatarUrl = avatarRes?.data?.avatarUrl;
  const href = getNotificationHref(notification.data);
  const isClickable = !!href;

  const handleClick = () => {
    if (href) navigate(href);
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-lg border transition-colors ${
        notification.isRead
          ? "bg-white border-stone-200"
          : "bg-accent/5 border-accent/30"
      } ${isClickable ? "cursor-pointer hover:border-primary/40 hover:shadow-sm" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar or icon */}
        <div className="shrink-0 relative">
          <Avatar className="w-10 h-10">
            {avatarUrl && (
              <AvatarImage src={avatarUrl} className="object-cover" />
            )}
            <AvatarFallback className="bg-stone-100 text-stone-500">
              {getNotificationIcon(notification.data.type)}
            </AvatarFallback>
          </Avatar>
          {/* Unread dot */}
          {!notification.isRead && (
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${notification.isRead ? "text-stone-700" : "text-stone-900 font-semibold"}`}
          >
            {notification.title}
          </p>
          <p className="text-sm text-stone-500 mt-0.5">
            {notification.message}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            {getNotificationSubtext(notification)} ·{" "}
            {new Date(notification.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

import type { Notification } from "@/features/notification/types/types";
import {
  NotificationType,
  getNotificationActorId,
} from "@/features/notification/types/types";
import { getNotificationHref } from "@/features/notification/lib/getNotificationHref";
import { markAsReadRequest } from "@/features/notification/api/MarkAsReadRequest";
import { useUserAvatar } from "@/features/user/hooks/useUserAvatar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UserPlus,
  UserCheck,
  UserX,
  MailOpen,
  FileClock,
  BadgeCheck,
  BadgeX,
} from "lucide-react";
import type {
  ApiResponseWithData,
  PaginatedApiResponse,
} from "@/shared/api/baseApi";

function getNotificationSubtext(notification: Notification): string {
  switch (notification.data.type) {
    case NotificationType.CONNECTION_REQUEST:
      return `from ${notification.data.senderUsername ?? "a user"}`;
    case NotificationType.CONNECTION_ACCEPTED:
      return `${notification.data.accepterUsername ?? "A user"} accepted`;
    case NotificationType.CONNECTION_REJECTED:
      return `${notification.data.rejecterUsername ?? "A user"} declined`;
    case NotificationType.EXPERT_APPLICATION_SUBMITTED:
      return notification.data.expertUsername
        ? `${notification.data.expertUsername} applied`
        : "New expert application";
    case NotificationType.EXPERT_APPLICATION_APPROVED:
      return "Your expert access is ready";
    case NotificationType.EXPERT_APPLICATION_REJECTED:
      return notification.data.rejectionReason
        ? "Application review complete"
        : "Your application was reviewed";
    default:
      return "";
  }
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.CONNECTION_REQUEST:
      return <UserPlus className="text-info h-4 w-4" strokeWidth={1.5} />;
    case NotificationType.CONNECTION_ACCEPTED:
      return <UserCheck className="text-success h-4 w-4" strokeWidth={1.5} />;
    case NotificationType.CONNECTION_REJECTED:
      return <UserX className="text-muted-foreground h-4 w-4" strokeWidth={1.5} />;
    case NotificationType.EXPERT_APPLICATION_SUBMITTED:
      return <FileClock className="text-primary h-4 w-4" strokeWidth={1.5} />;
    case NotificationType.EXPERT_APPLICATION_APPROVED:
      return <BadgeCheck className="text-success h-4 w-4" strokeWidth={1.5} />;
    case NotificationType.EXPERT_APPLICATION_REJECTED:
      return <BadgeX className="text-destructive h-4 w-4" strokeWidth={1.5} />;
    default:
      return null;
  }
}

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const actorId = getNotificationActorId(notification.data);
  const { data: avatarRes } = useUserAvatar(actorId);
  const avatarUrl = avatarRes?.data?.avatarUrl;
  const href = getNotificationHref(notification.data);
  const isClickable = !!href;

  const { mutate: markAsRead } = useMutation({
    mutationFn: () => markAsReadRequest(notification.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      await queryClient.cancelQueries({
        queryKey: ["notifications-unread-count"],
      });

      const previousNotifications = queryClient.getQueryData<{
        pages: PaginatedApiResponse<Notification[]>[];
        pageParams: unknown[];
      }>(["notifications"]);

      const previousUnreadCount = queryClient.getQueryData<
        ApiResponseWithData<{ count: number }>
      >(["notifications-unread-count"]);

      queryClient.setQueryData<typeof previousNotifications>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((n) =>
                n.id === notification.id ? { ...n, isRead: true } : n,
              ),
            })),
          };
        },
      );

      queryClient.setQueryData<ApiResponseWithData<{ count: number }>>(
        ["notifications-unread-count"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: { count: Math.max(0, old.data.count - 1) },
          };
        },
      );

      return { previousNotifications, previousUnreadCount };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(
          ["notifications-unread-count"],
          context.previousUnreadCount,
        );
      }
    },
  });

  const handleClick = () => {
    if (href) navigate(href);
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead();
  };

  return (
    <div
      onClick={handleClick}
      className={`rounded-lg border p-4 transition-colors ${
        notification.isRead
          ? "bg-card border-border"
          : "bg-secondary/50 border-primary/25"
      } ${isClickable ? "cursor-pointer hover:border-primary" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar or icon */}
        <div className="shrink-0 relative">
          <Avatar className="w-10 h-10">
            {avatarUrl && (
              <AvatarImage src={avatarUrl} className="object-cover" />
            )}
            <AvatarFallback className="bg-secondary text-muted-foreground">
              {getNotificationIcon(notification.data.type)}
            </AvatarFallback>
          </Avatar>
          {/* Unread dot */}
          {!notification.isRead && (
            <div className="bg-live border-card absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${notification.isRead ? "text-foreground" : "text-foreground font-semibold"}`}
          >
            {notification.title}
          </p>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {notification.message}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {getNotificationSubtext(notification)} ·{" "}
            {new Date(notification.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Mark as read button */}
        {!notification.isRead && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleMarkAsRead}
                className="text-muted-foreground hover:bg-secondary hover:text-foreground shrink-0 rounded-md p-1.5 transition-colors"
              >
                <MailOpen className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Mark as read</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

import type { Notification } from "@/features/notification/types/types";
import { getNotificationHref } from "@/features/notification/lib/getNotificationHref";
import { RoutePath } from "@/shared/config/routes";
import toast from "react-hot-toast";
import { X } from "lucide-react";

interface NotificationToastProps {
  notification: Notification;
  toastId: string;
  onNavigate: (path: string) => void;
}

export const NotificationToast = ({
  notification,
  toastId,
  onNavigate,
}: NotificationToastProps) => {
  const href =
    getNotificationHref(notification.data) ?? RoutePath.Notifications;

  return (
    <div className="bg-popover text-popover-foreground border-border pointer-events-auto w-80 overflow-hidden rounded-lg border shadow-md">
      <div className="flex items-start gap-3 p-4">
        <div className="bg-primary w-1 self-stretch shrink-0 rounded-full" />

        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => {
            toast.dismiss(toastId);
            onNavigate(href);
          }}
        >
          <p className="truncate text-sm font-semibold">
            {notification.title}
          </p>
          <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm">
            {notification.message}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">Just now</p>
        </div>

        <button
          onClick={() => toast.dismiss(toastId)}
          className="text-muted-foreground hover:bg-secondary hover:text-foreground shrink-0 rounded p-1 transition-colors"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

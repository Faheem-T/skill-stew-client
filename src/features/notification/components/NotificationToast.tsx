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
    <div className="pointer-events-auto w-80 rounded-lg border border-stone-200 bg-white shadow-lg overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        {/* Colored accent bar */}
        <div className="w-1 self-stretch rounded-full bg-primary shrink-0" />

        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => {
            toast.dismiss(toastId);
            onNavigate(href);
          }}
        >
          <p className="text-sm font-semibold text-stone-900 truncate">
            {notification.title}
          </p>
          <p className="text-sm text-stone-600 mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-stone-400 mt-1">Just now</p>
        </div>

        <button
          onClick={() => toast.dismiss(toastId)}
          className="shrink-0 p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

import { getNotificationActorId } from "@/features/notification/types/types";
import type { NotificationData } from "@/features/notification/types/types";
import { RoutePath } from "@/shared/config/routes";

/**
 * Resolves a navigation path for a given notification.
 *
 * To add navigation for a new notification type:
 *   1. Add the type to `NotificationType` and its data interface.
 *   2. Add a case (or regex key) here that returns the target path.
 */
export function getNotificationHref(data: NotificationData): string | null {
  // ── CONNECTION_* notifications → public profile ──
  if (data.type.startsWith("CONNECTION")) {
    const userId = getNotificationActorId(data);
    if (userId) {
      return RoutePath.PublicProfile.replace(":id", userId);
    }
  }

  // ── Add new notification type handlers here ──
  // Example:
  // if (data.type === NotificationType.WORKSHOP_REMINDER) {
  //   return `/workshops/${data.workshopId}`;
  // }

  return null;
}

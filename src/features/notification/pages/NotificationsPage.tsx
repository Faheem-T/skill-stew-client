import { AppNavbar } from "@/shared/components/layout/AppNavbar";
import { Loader2, Bell, BellOff } from "lucide-react";
import { useNotifications } from "@/features/notification/hooks/useNotifications";
import { NotificationItem } from "@/features/notification/components/NotificationItem";
import { useEffect, useRef } from "react";

export const NotificationsPage = () => {
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotifications();

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="min-h-screen bg-stone-50">
      <AppNavbar />
      <div className="container mx-auto px-6 md:px-12 py-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-6 h-6 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            Notifications
          </h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-lg border border-stone-200">
            <p className="text-stone-600">
              Failed to load notifications. Please try again.
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-stone-200">
            <BellOff className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 font-medium">No notifications yet</p>
            <p className="text-sm text-stone-400 mt-1">
              You'll be notified when something happens
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}

            {/* Intersection sentinel + loading spinner */}
            <div ref={sentinelRef} className="py-4 flex justify-center">
              {isFetchingNextPage && (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

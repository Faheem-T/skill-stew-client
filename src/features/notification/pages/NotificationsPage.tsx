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
    <div className="bg-background min-h-screen">
      <AppNavbar />
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-10">
        <div className="mb-8 flex items-center gap-3">
          <Bell className="text-primary h-6 w-6" strokeWidth={1.5} />
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
            Notifications
          </h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-primary h-8 w-8 animate-spin" strokeWidth={1.5} />
          </div>
        ) : error ? (
          <div className="bg-card border-border rounded-lg border py-20 text-center">
            <p className="text-muted-foreground">
              Failed to load notifications. Please try again.
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-card border-border rounded-lg border py-20 text-center">
            <BellOff className="text-muted-foreground mx-auto mb-3 h-10 w-10" strokeWidth={1.5} />
            <p className="text-foreground font-medium">No notifications yet</p>
            <p className="text-muted-foreground mt-1 text-sm">
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
                <Loader2 className="text-primary h-5 w-5 animate-spin" strokeWidth={1.5} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import { Bell, MessageSquareDotIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import type React from "react";
import { InitialLoadScreen } from "@/app/pages/InitialLoadScreen";
import { useAdminProfile } from "@/shared/hooks/useAdminProfile";
import { ThemeToggle } from "@/shared/components/theme/ThemeToggle";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUnreadCountRequest } from "@/features/notification/api/GetUnreadCount";
import { RoutePath } from "@/shared/config/routes";
import { Badge } from "@/shared/components/ui/badge";

export const AdminTopBar: React.FC<{
  mainText: string;
  subText?: string;
  sideItems?: React.ReactNode;
}> = ({ mainText, subText, sideItems }) => {
  const { data: userProfile, isLoading } = useAdminProfile();
  const { data: unreadCountData } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: getUnreadCountRequest,
    refetchOnWindowFocus: false,
  });

  const unreadCount = unreadCountData?.data?.count ?? 0;

  if (isLoading) {
    return <InitialLoadScreen />;
  }

  return (
    <div className="border-border/80 bg-background/95 sticky top-0 z-20 flex min-h-14 items-center justify-between gap-4 border-b px-4 py-3 md:px-8">
      <div className="min-w-0">
        <div className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {mainText}
        </div>
        {subText && (
          <div className="mt-1 text-sm text-muted-foreground">{subText}</div>
        )}
      </div>
      {!sideItems ? (
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Button asChild type="button" variant="ghost" size="icon" className="relative">
            <Link to={RoutePath.Notifications} aria-label="Open notifications">
              <Bell className="h-5 w-5" strokeWidth={1.5} />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 min-w-5 rounded-full px-1.5 py-0 text-[10px] leading-4">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Link>
          </Button>

          <Button type="button" variant="ghost" size="icon">
            <MessageSquareDotIcon strokeWidth={1.5} />
          </Button>

          <Avatar className="h-9 w-9 rounded-full border border-border/80">
            <AvatarImage src={undefined} className="object-cover" />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
              {userProfile?.username?.slice(0, 2) ?? "A"}
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        sideItems
      )}
    </div>
  );
};

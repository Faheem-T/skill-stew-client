import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { APP_NAME } from "@/shared/config/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type React from "react";
import { Button } from "@/shared/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Link, useLocation } from "react-router";
import { useCurrentUserProfile } from "@/shared/hooks/useCurrentUserProfile";
import { Bell, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { InitialLoadScreen } from "@/app/pages/InitialLoadScreen";
import { RoutePath } from "@/shared/config/routes";
import { useQuery } from "@tanstack/react-query";
import { getUnreadCountRequest } from "@/features/notification/api/GetUnreadCount";
import { ThemeToggle } from "@/shared/components/theme/ThemeToggle";

/**
 * AppNavbar - Navigation bar for authenticated users
 * Shows app-specific navigation, search, notifications, and user menu
 */
export const AppNavbar: React.FC = () => {
  const { data: userProfile, isPending: isProfilePending } =
    useCurrentUserProfile();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (isProfilePending) {
    return <InitialLoadScreen />;
  }

  return (
    <div className="border-border/80 bg-background/95 sticky top-0 z-50 flex h-14 items-center justify-between border-b px-4 md:px-10">
      {/* Logo */}
      <Link
        to={RoutePath.Dashboard}
        className="h-full flex items-center gap-2.5"
      >
        <img src="/logo.png" className="h-9 w-9 object-contain" />
        <span className="text-lg font-semibold text-foreground">{APP_NAME}</span>
      </Link>

      {/* Navigation links - centered */}
      <nav className="hidden md:flex items-center gap-1">
        <Link to={RoutePath.Dashboard}>
          <Button
            variant="ghost"
            className={
              isActive(RoutePath.Dashboard) ||
              isActive(RoutePath.UserDashboard) ||
              isActive(RoutePath.ExpertDashboard)
                ? "bg-secondary text-foreground"
                : ""
            }
          >
            Dashboard
          </Button>
        </Link>
        <Link to={RoutePath.Workshops}>
          <Button
            variant="ghost"
            className={
              isActive(RoutePath.Workshops)
                ? "bg-secondary text-foreground"
                : ""
            }
          >
            Workshops
          </Button>
        </Link>
        <Link to={RoutePath.Exchanges}>
          <Button
            variant="ghost"
            className={
              isActive(RoutePath.Exchanges)
                ? "bg-secondary text-foreground"
                : ""
            }
          >
            Skill Exchanges
          </Button>
        </Link>
        <Link to={RoutePath.Community}>
          <Button
            variant="ghost"
            className={
              isActive(RoutePath.Community)
                ? "bg-secondary text-foreground"
                : ""
            }
          >
            Community
          </Button>
        </Link>
      </nav>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {/* Search */}
        <div className="hidden lg:block relative">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" strokeWidth={1.5} />
          <Input
            placeholder="Search workshops, users..."
            className="h-9 w-64 pl-9"
          />
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* User avatar */}
        {userProfile && <UserAvatar />}
      </div>
    </div>
  );
};

const UserAvatar: React.FC = () => {
  const { mutate, isPending } = useLogout();
  const { data: userProfile, isPending: isProfilePending } =
    useCurrentUserProfile();

  if (isProfilePending) {
    return (
      <Avatar className="h-9 w-9 cursor-pointer">
        <AvatarFallback className="bg-secondary text-muted-foreground text-sm">
          ...
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="border-border hover:border-primary h-9 w-9 cursor-pointer overflow-hidden rounded-full border transition-colors">
          <AvatarImage
            src={
              userProfile?.role === "USER" || userProfile?.role === "ADMIN"
                ? userProfile?.avatarUrl
                : undefined
            }
            className="h-full w-full object-cover"
          />
          <AvatarFallback className="bg-secondary text-muted-foreground text-sm font-medium">
            {userProfile?.email.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="flex flex-col items-start py-3">
          <div className="text-sm font-medium text-foreground">
            {userProfile?.role === "USER" && userProfile?.name
              ? userProfile.name
              : userProfile?.email}
          </div>
          <div className="text-muted-foreground mt-0.5 text-xs">
            {(userProfile?.role === "USER" || userProfile?.role === "ADMIN") &&
              userProfile?.username &&
              `@${userProfile.username}`}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="bg-border h-px p-0" />
        <DropdownMenuItem asChild>
          <Link to={RoutePath.Dashboard} className="cursor-pointer">
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={RoutePath.UserProfile} className="cursor-pointer">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={RoutePath.Settings} className="cursor-pointer">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="bg-border h-px p-0" />
        <DropdownMenuItem asChild>
          <Button
            disabled={isPending}
            onClick={() => mutate()}
            variant="ghost"
            className="h-auto w-full justify-start p-2"
          >
            {isPending ? "Logging out..." : "Log Out"}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NotificationBell: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: getUnreadCountRequest,
    refetchOnWindowFocus: false,
  });

  const count = data?.data?.count ?? 0;

  return (
    <Link to={RoutePath.Notifications}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="bg-live text-live-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Button>
    </Link>
  );
};

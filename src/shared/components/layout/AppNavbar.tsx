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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type React from "react";
import { Button } from "@/shared/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Link, useLocation } from "react-router";
import { useCurrentUserProfile } from "@/shared/hooks/useCurrentUserProfile";
import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { InitialLoadScreen } from "@/app/pages/InitialLoadScreen";
import { RoutePath } from "@/shared/config/routes";
import { useQuery } from "@tanstack/react-query";
import { getUnreadCountRequest } from "@/features/notification/api/GetUnreadCount";
import { ThemeToggle } from "@/shared/components/theme/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/shared/components/ui/sheet";

/**
 * AppNavbar - Navigation bar for authenticated users
 * Shows app-specific navigation, search, notifications, and user menu
 */
export const AppNavbar: React.FC = () => {
  const { data: userProfile, isPending: isProfilePending } =
    useCurrentUserProfile();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === RoutePath.Workshops) {
      return (
        location.pathname === RoutePath.Workshops ||
        location.pathname.startsWith("/workshops/")
      );
    }
    return location.pathname === path;
  };

  const isDashboardActive =
    isActive(RoutePath.Dashboard) ||
    isActive(RoutePath.UserDashboard) ||
    isActive(RoutePath.ExpertDashboard);

  const navLinks = [
    { to: RoutePath.Dashboard, label: "Dashboard", active: isDashboardActive },
    { to: RoutePath.Workshops, label: "Workshops", active: isActive(RoutePath.Workshops) },
    { to: RoutePath.Exchanges, label: "Skill Exchanges", active: isActive(RoutePath.Exchanges) },
    { to: RoutePath.Community, label: "Community", active: isActive(RoutePath.Community) },
  ];

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
        <img src="/logo.png" alt={APP_NAME} className="h-9 w-9 object-contain" />
        <span className="text-lg font-semibold text-foreground">{APP_NAME}</span>
      </Link>

      {/* Navigation links - centered, desktop only */}
      <nav aria-label="App navigation" className="hidden md:flex items-center gap-1">
        {navLinks.map(({ to, label, active }) => (
          <Link to={to} key={to}>
            <Button
              variant="ghost"
              className={active ? "bg-secondary text-foreground" : ""}
            >
              {label}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Search - desktop only */}
        <div className="hidden lg:block relative">
          <Search
            className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <Input
            placeholder="Search workshops, users…"
            className="h-9 w-48 xl:w-64 pl-9"
          />
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader className="pb-2">
              <SheetTitle className="flex items-center gap-2">
                <img src="/logo.png" alt={APP_NAME} className="h-7 w-7 object-contain" />
                <span className="text-base font-semibold">{APP_NAME}</span>
              </SheetTitle>
            </SheetHeader>
            <nav aria-label="App navigation mobile" className="flex flex-col gap-1 px-4">
              {navLinks.map(({ to, label, active }) => (
                <SheetClose asChild key={to}>
                  <Link
                    to={to}
                    className={`rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-secondary text-foreground"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    {label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            {/* Mobile search */}
            <div className="px-4 pt-4 border-t border-border">
              <div className="relative">
                <Search
                  className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <Input
                  placeholder="Search workshops, users…"
                  className="h-9 w-full pl-9"
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* User avatar */}
        {userProfile && (
          <UserAvatar
            avatarUrl={
              userProfile.role === "USER" || userProfile.role === "ADMIN"
                ? userProfile.avatarUrl
                : undefined
            }
            email={userProfile.email}
            name={userProfile.role === "USER" ? userProfile.name : undefined}
            username={
              userProfile.role === "USER" || userProfile.role === "ADMIN"
                ? userProfile.username
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

interface UserAvatarProps {
  avatarUrl?: string;
  email: string;
  name?: string | null;
  username?: string | null;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatarUrl, email, name, username }) => {
  const { mutate, isPending } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          aria-label="Open user menu"
          className="border-border hover:border-primary h-9 w-9 cursor-pointer overflow-hidden rounded-full border transition-colors"
        >
          <AvatarImage
            src={avatarUrl}
            className="h-full w-full object-cover"
          />
          <AvatarFallback className="bg-secondary text-muted-foreground text-sm font-medium">
            {email.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex flex-col items-start py-3 font-normal">
          <span className="text-sm font-medium text-foreground">
            {name ?? email}
          </span>
          {username && (
            <span className="text-muted-foreground mt-0.5 text-xs">
              @{username}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={RoutePath.Dashboard}>
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={RoutePath.UserProfile}>
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={RoutePath.Settings}>
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            disabled={isPending}
            onClick={() => mutate()}
            variant="ghost"
            className="h-auto w-full justify-start p-2"
          >
            {isPending ? "Logging out…" : "Log Out"}
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
        aria-label={count > 0 ? `Notifications, ${count > 99 ? "99+" : count} unread` : "Notifications"}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {count > 0 && (
          <span
            aria-hidden="true"
            className="bg-live text-live-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-xs font-bold leading-none"
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Button>
    </Link>
  );
};

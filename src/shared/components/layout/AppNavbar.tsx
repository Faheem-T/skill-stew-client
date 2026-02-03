import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { APP_NAME } from "@/shared/config/constants";
import { useAppStore } from "@/app/store";
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
import { useUserProfile } from "@/shared/hooks/useUserProfile";
import { Bell, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

/**
 * AppNavbar - Navigation bar for authenticated users
 * Shows app-specific navigation, search, notifications, and user menu
 */
export const AppNavbar: React.FC = () => {
  const user = useAppStore((state) => state.user);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-16 flex items-center justify-between bg-white border-b border-stone-200 px-6 md:px-12 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/dashboard" className="h-full flex items-center gap-2.5">
        <img src="/logo.png" className="h-9 w-9 object-contain" />
        <span className="font-semibold text-lg text-primary">{APP_NAME}</span>
      </Link>

      {/* Navigation links - centered */}
      <nav className="hidden md:flex items-center gap-1">
        <Link to="/dashboard">
          <Button
            variant="ghost"
            className={
              isActive("/dashboard") || isActive("/dashboard/user")
                ? "text-primary bg-primary/10"
                : "text-stone-600 hover:text-primary hover:bg-stone-100"
            }
          >
            Dashboard
          </Button>
        </Link>
        <Link to="/workshops">
          <Button
            variant="ghost"
            className={
              isActive("/workshops")
                ? "text-primary bg-primary/10"
                : "text-stone-600 hover:text-primary hover:bg-stone-100"
            }
          >
            Workshops
          </Button>
        </Link>
        <Link to="/exchanges">
          <Button
            variant="ghost"
            className={
              isActive("/exchanges")
                ? "text-primary bg-primary/10"
                : "text-stone-600 hover:text-primary hover:bg-stone-100"
            }
          >
            Skill Exchanges
          </Button>
        </Link>
        <Link to="/community">
          <Button
            variant="ghost"
            className={
              isActive("/community")
                ? "text-primary bg-primary/10"
                : "text-stone-600 hover:text-primary hover:bg-stone-100"
            }
          >
            Community
          </Button>
        </Link>
      </nav>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden lg:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search workshops, users..."
            className="pl-9 w-64 h-9 bg-stone-50 border-stone-200 focus-visible:ring-primary/20"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="text-stone-600 hover:text-primary"
        >
          <Bell className="h-5 w-5" />
        </Button>

        {/* User avatar */}
        {user && <UserAvatar />}
      </div>
    </div>
  );
};

const UserAvatar: React.FC = () => {
  const user = useAppStore((state) => state.user)!;
  const { mutate, isPending } = useLogout();
  const { data, isPending: isProfilePending } = useUserProfile();

  if (isProfilePending) {
    return (
      <Avatar className="h-9 w-9 cursor-pointer">
        <AvatarFallback className="bg-stone-200 text-stone-600 text-sm">
          ...
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all overflow-hidden rounded-full">
          <AvatarImage
            src={data?.avatarUrl}
            className="h-full w-full object-cover"
          />
          <AvatarFallback className="bg-stone-200 text-stone-600 text-sm font-medium">
            {user.email.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 rounded-lg border-stone-200"
      >
        <DropdownMenuItem className="flex flex-col items-start py-3">
          <div className="text-sm font-medium text-stone-900">{user.email}</div>
          <div className="text-xs text-stone-500 mt-0.5">
            {data?.name || "Member"}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="h-px bg-stone-100 p-0" />
        <DropdownMenuItem asChild>
          <Link
            to="/dashboard"
            className="cursor-pointer text-stone-600 hover:text-primary"
          >
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/profile"
            className="cursor-pointer text-stone-600 hover:text-primary"
          >
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/settings"
            className="cursor-pointer text-stone-600 hover:text-primary"
          >
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="h-px bg-stone-100 p-0" />
        <DropdownMenuItem asChild>
          <Button
            disabled={isPending}
            onClick={() => mutate()}
            variant="ghost"
            className="w-full justify-start text-stone-600 hover:text-primary h-auto p-2"
          >
            {isPending ? "Logging out..." : "Log Out"}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

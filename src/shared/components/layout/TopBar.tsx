import { Avatar } from "@/shared/components/ui/avatar";
import { APP_NAME } from "@/shared/config/constants";

import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type React from "react";
import { Button } from "@/shared/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Link } from "react-router";
import { useCurrentUserProfile } from "@/shared/hooks/useCurrentUserProfile";
import { InitialLoadScreen } from "@/app/pages/InitialLoadScreen";
import { RoutePath } from "@/shared/config/routes";
import { ThemeToggle } from "@/shared/components/theme/ThemeToggle";

export const TopBar: React.FC = () => {
  const { data: userProfile, isPending: isProfilePending } =
    useCurrentUserProfile();

  if (isProfilePending) {
    return <InitialLoadScreen />;
  }

  return (
    <div className="border-border/80 bg-background/95 sticky top-0 z-50 flex h-14 items-center justify-between border-b px-4 md:px-20">
      {/* Logo */}
      <Link to={RoutePath.Home} className="h-full flex items-center gap-2.5">
        <img src="/logo.png" className="h-9 w-9 object-contain" />
        <span className="text-lg font-semibold text-foreground">{APP_NAME}</span>
      </Link>

      {/* Nav links - hidden on mobile */}
      <nav className="hidden md:flex items-center gap-6">
        <Link
          to={RoutePath.Home}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Home
        </Link>
        <a
          href="#features"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Features
        </a>
        <a
          href="#how-it-works"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          How it Works
        </a>
        <a
          href="#reviews"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Reviews
        </a>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {userProfile ? (
          <UserAvatar />
        ) : (
          <>
            <Link to={RoutePath.Login}>
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to={RoutePath.Register}>
              <Button>Get Started</Button>
            </Link>
          </>
        )}
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
          U
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
              userProfile?.role === "USER" ? userProfile?.avatarUrl : undefined
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
          {userProfile?.role === "USER" && userProfile?.username && (
            <div className="text-muted-foreground mt-0.5 text-xs">
              @{userProfile.username}
            </div>
          )}
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

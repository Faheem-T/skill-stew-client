import { Avatar } from "@/shared/components/ui/avatar";
import { APP_NAME } from "@/shared/config/constants";
import { useAppStore } from "@/app/store";
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

export const TopBar: React.FC = () => {
  const { data: userProfile, isPending: isProfilePending } =
    useCurrentUserProfile();

  if (isProfilePending) {
    return <InitialLoadScreen />;
  }

  return (
    <div className="h-16 flex items-center justify-between bg-stone-50/80 backdrop-blur-md border-b border-stone-200/60 px-6 md:px-12 sticky top-0 z-50">
      {/* Logo */}
      <Link to={RoutePath.Home} className="h-full flex items-center gap-2.5">
        <img src="/logo.png" className="h-9 w-9 object-contain" />
        <span className="font-semibold text-lg text-primary">{APP_NAME}</span>
      </Link>

      {/* Nav links - hidden on mobile */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          to={RoutePath.Home}
          className="text-sm text-stone-600 hover:text-primary transition-colors"
        >
          Home
        </Link>
        <a
          href="#features"
          className="text-sm text-stone-600 hover:text-primary transition-colors"
        >
          Features
        </a>
        <a
          href="#how-it-works"
          className="text-sm text-stone-600 hover:text-primary transition-colors"
        >
          How it Works
        </a>
        <a
          href="#reviews"
          className="text-sm text-stone-600 hover:text-primary transition-colors"
        >
          Reviews
        </a>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {userProfile?.role === "USER" ? (
          <UserAvatar />
        ) : (
          <>
            <Link to={RoutePath.Login}>
              <Button
                variant="ghost"
                className="text-stone-600 hover:text-primary hover:bg-stone-100"
              >
                Log In
              </Button>
            </Link>
            <Link to={RoutePath.Register}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md">
                Get Started
              </Button>
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
        <AvatarFallback className="bg-stone-200 text-stone-600 text-sm">
          U
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all overflow-hidden rounded-full">
          <AvatarImage
            src={
              userProfile?.role === "USER" ? userProfile?.avatarUrl : undefined
            }
            className="h-full w-full object-cover"
          />
          <AvatarFallback className="bg-stone-200 text-stone-600 text-sm font-medium">
            {userProfile?.email.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 rounded-lg border-stone-200"
      >
        <DropdownMenuItem className="flex flex-col items-start py-3">
          <div className="text-sm font-medium text-stone-900">
            {userProfile?.role === "USER" && userProfile?.name
              ? userProfile.name
              : userProfile?.email}
          </div>
          {userProfile?.role === "USER" && userProfile?.username && (
            <div className="text-xs text-stone-500 mt-0.5">
              @{userProfile.username}
            </div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="h-px bg-stone-100 p-0" />
        <DropdownMenuItem asChild>
          <Link
            to={RoutePath.Dashboard}
            className="cursor-pointer text-stone-600 hover:text-primary"
          >
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to={RoutePath.UserProfile}
            className="cursor-pointer text-stone-600 hover:text-primary"
          >
            Profile
          </Link>
        </DropdownMenuItem>
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

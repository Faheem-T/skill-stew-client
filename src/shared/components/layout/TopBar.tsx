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
import { Link } from "react-router";
import { useCurrentUserProfile } from "@/shared/hooks/useCurrentUserProfile";
import { InitialLoadScreen } from "@/app/pages/InitialLoadScreen";
import { RoutePath } from "@/shared/config/routes";
import { ThemeToggle } from "@/shared/components/theme/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/shared/components/ui/sheet";
import { Menu } from "lucide-react";

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
        <img src="/logo.png" alt={APP_NAME} className="h-9 w-9 object-contain" />
        <span className="text-lg font-semibold text-foreground">{APP_NAME}</span>
      </Link>

      {/* Nav links - hidden on mobile */}
      <nav aria-label="Marketing navigation" className="hidden md:flex items-center gap-6">
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
            <nav aria-label="Marketing navigation mobile" className="flex flex-col gap-1 px-4">
              <SheetClose asChild>
                <Link
                  to={RoutePath.Home}
                  className="text-foreground hover:bg-accent rounded-md px-3 py-3 text-sm font-medium transition-colors"
                >
                  Home
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <a
                  href="#features"
                  className="text-foreground hover:bg-accent rounded-md px-3 py-3 text-sm font-medium transition-colors"
                >
                  Features
                </a>
              </SheetClose>
              <SheetClose asChild>
                <a
                  href="#how-it-works"
                  className="text-foreground hover:bg-accent rounded-md px-3 py-3 text-sm font-medium transition-colors"
                >
                  How it Works
                </a>
              </SheetClose>
              <SheetClose asChild>
                <a
                  href="#reviews"
                  className="text-foreground hover:bg-accent rounded-md px-3 py-3 text-sm font-medium transition-colors"
                >
                  Reviews
                </a>
              </SheetClose>
            </nav>
            {!userProfile && (
              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border">
                <SheetClose asChild>
                  <Link to={RoutePath.Login}>
                    <Button variant="ghost" className="w-full justify-center">Log In</Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to={RoutePath.Register}>
                    <Button className="w-full justify-center">Get Started</Button>
                  </Link>
                </SheetClose>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {userProfile ? (
          <UserAvatar
            avatarUrl={userProfile.role === "USER" ? userProfile.avatarUrl : undefined}
            email={userProfile.email}
            name={userProfile.role === "USER" ? userProfile.name : undefined}
            username={userProfile.role === "USER" ? userProfile.username : undefined}
          />
        ) : (
          <>
            <Link to={RoutePath.Login} className="hidden md:block">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to={RoutePath.Register} className="hidden md:block">
              <Button>Get Started</Button>
            </Link>
          </>
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

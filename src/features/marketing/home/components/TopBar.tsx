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
import { useUserProfile } from "@/shared/hooks/useUserProfile";

export const TopBar: React.FC = () => {
  const user = useAppStore((state) => state.user);
  return (
    <div className="h-16 flex items-center justify-between border-b border-slate-200 bg-white shadow-sm px-12">
      {/*Logo*/}
      <div className="h-full flex items-center gap-3">
        <img src="/logo.png" className="h-12 w-12 object-contain" />
        <div className="font-bold text-xl bg-primary bg-clip-text text-transparent">
          {APP_NAME}
        </div>
      </div>
      {/*Nav links*/}
      <div className="flex items-center gap-8">
        <Link to="/" className="text-slate-700 hover:text-primary font-medium transition-colors">Home</Link>
        <a href="#about" className="text-slate-700 hover:text-primary font-medium transition-colors">About</a>
        <a href="#contact" className="text-slate-700 hover:text-primary font-medium transition-colors">Contact</a>
      </div>
      {/*Actions*/}
      <div className="flex items-center">
        {user?.role === "USER" ? (
          <UserAvatar />
        ) : (
          <Link to="/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Log In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

const UserAvatar: React.FC = () => {
  const user = useAppStore((state) => state.user)!;
  if (user.role === "ADMIN") {
    throw new Error("Unexpected User");
  }

  const { mutate, isPending } = useLogout();
  const { data, isPending: isProfilePending } = useUserProfile();
  if (isProfilePending) {
    return (
      <Avatar className="h-10 w-10 cursor-pointer">
        <AvatarFallback className="bg-primary/10">U</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-offset-2 ring-primary/30 hover:ring-primary/60 transition-all overflow-hidden rounded-full">
          <AvatarImage src={data.avatarUrl} className="h-full w-full object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {user.email.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="flex flex-col items-start py-3">
          <div className="text-sm font-semibold text-slate-900">{user.email}</div>
          <div className="text-xs text-slate-500 mt-1">Member</div>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="h-px bg-slate-200" />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="cursor-pointer text-slate-700 hover:text-primary">
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button 
            disabled={isPending} 
            onClick={() => mutate()}
            variant="ghost"
            className="w-full justify-start text-slate-700 hover:text-primary h-auto p-2"
          >
            {isPending ? "Logging out..." : "Log Out"}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import { Avatar } from "@/components/ui/avatar";
import { APP_NAME } from "@/lib/constants";
import { useAppStore } from "@/store";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import type React from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";
import { Link } from "react-router";

export const TopBar: React.FC = () => {
  const user = useAppStore((state) => state.user);
  return (
    <div className="h-12 flex items-center justify-between border-b rounded-2xl">
      {/*Logo*/}
      <div className="h-full px-1 flex items-center">
        <img src="/logo.png" className="h-full" />
        <div className="font-bold">{APP_NAME}</div>
      </div>
      {/*Nav links*/}
      <div className="flex items-center gap-4 p-4">
        <div>Home</div>
        <div>About</div>
        <div>Contact</div>
      </div>
      {/*Actions*/}
      <div className="p-4">
        {user ? <UserAvatar /> : <Link to="/login">Log In</Link>}
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="/person.jpg" />
          <AvatarFallback>
            {user.username?.slice(0, 2) ?? user.email.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Wassup</DropdownMenuItem>
        <DropdownMenuItem>
          <Button disabled={isPending} onClick={() => mutate()}>
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

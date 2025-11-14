import { Bell, MessageSquareDotIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAppStore } from "@/app/store";
import type React from "react";

export const AdminTopBar: React.FC<{
  mainText: string;
  subText?: string;
  sideItems?: React.ReactNode;
}> = ({ mainText, subText, sideItems }) => {
  const user = useAppStore((state) => state.user)!;

  return (
    <div className="flex justify-between items-center m-4 h-14">
      <div className="flex flex-col gap-1">
        <div className="font-bold text-3xl">{mainText}</div>
        {subText && <div className="text-muted-foreground">{subText}</div>}
      </div>
      {!sideItems ? (
        <div className="flex gap-4">
          <Button type="button" variant="outline" size="icon">
            <Bell />
          </Button>
          <Button type="button" variant="outline" size="icon">
            <MessageSquareDotIcon />
          </Button>
          <Avatar className="rounded-full">
            <AvatarImage src="person.jpg" className="object-cover" />
            <AvatarFallback>
              {user?.username?.slice(0, 2) ?? "A"}
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        sideItems
      )}
    </div>
  );
};

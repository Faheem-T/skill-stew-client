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

export const AdminTopBar: React.FC<{
  mainText: string;
  subText?: string;
  sideItems?: React.ReactNode;
}> = ({ mainText, subText, sideItems }) => {
  const { data: userProfile, isLoading } = useAdminProfile();

  if (isLoading) {
    return <InitialLoadScreen />;
  }

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

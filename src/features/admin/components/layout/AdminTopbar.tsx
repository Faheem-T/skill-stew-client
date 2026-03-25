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
import { ThemeToggle } from "@/shared/components/theme/ThemeToggle";

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
    <div className="border-border bg-background/95 sticky top-0 z-20 flex h-14 items-center justify-between border-b px-4 md:px-8">
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-semibold">{mainText}</div>
        {subText && <div className="text-muted-foreground text-sm">{subText}</div>}
      </div>
      {!sideItems ? (
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button type="button" variant="outline" size="icon">
            <Bell strokeWidth={1.5} />
          </Button>
          <Button type="button" variant="outline" size="icon">
            <MessageSquareDotIcon strokeWidth={1.5} />
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

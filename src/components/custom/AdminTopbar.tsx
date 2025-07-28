import { Bell, MessageSquareDotIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppStore } from "@/store";

export const AdminTopBar = ({ mainText }: { mainText: string }) => {
  const user = useAppStore((state) => state.user)!;

  return (
    <div className="flex justify-between items-center m-4 h-14">
      <div className="font-bold text-3xl">{mainText}</div>
      <div className="flex gap-4">
        <Button type="button" variant="outline" size="icon">
          <Bell />
        </Button>
        <Button type="button" variant="outline" size="icon">
          <MessageSquareDotIcon />
        </Button>
        <Avatar className="rounded-full">
          <AvatarImage src="person.jpg" className="object-cover" />
          <AvatarFallback>{user?.username?.slice(0, 2) ?? "A"}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

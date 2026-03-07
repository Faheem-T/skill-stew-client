import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useConnectedUsers } from "../hooks/useConnectedUsers";
import { Loader2 } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useNavigate } from "react-router";
import { useEffect } from "react";

interface ConnectedUsersModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConnectedUsersModal = ({
  userId,
  open,
  onOpenChange,
}: ConnectedUsersModalProps) => {
  const navigate = useNavigate();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useConnectedUsers(open ? userId : undefined);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleUserClick = (id: string) => {
    onOpenChange(false);
    navigate(`/user/${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-stone-900">
            Connections
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-[30vh] pr-2 mt-4 space-y-4">
          {isLoading && (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            </div>
          )}

          {!isLoading &&
            data?.pages.map((page, i) => (
              <div key={i} className="space-y-4">
                {page.data.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={user.avatarUrl || undefined}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-accent/30 text-primary">
                        {user.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-stone-900">
                        {user.username || "User"}
                      </p>
                      {user.username && (
                        <p className="text-xs text-stone-500">
                          @{user.username}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {!isLoading && data?.pages[0]?.data.length === 0 && (
            <div className="text-center text-stone-500 py-8">
              No connections yet.
            </div>
          )}

          {hasNextPage && (
            <div className="pt-4 pb-2 flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

import type {
  ApiErrorResponseType,
  ApiResponseWithData,
  ApiResponseWithMessage,
} from "@/api/baseApi";
import { blockUser } from "@/api/users/BlockUser";
import { getUsers, type User } from "@/api/users/GetUsers";
import { unblockUser } from "@/api/users/UnblockUser";
import { AdminTopBar } from "@/components/custom/AdminTopbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import toast from "react-hot-toast";

export const UserManagement = () => {
  return (
    <div className="">
      <AdminTopBar mainText="User Management" />
      <div className="p-4">
        <UserTable />
      </div>
    </div>
  );
};

const UserTable = () => {
  const { data, isFetching, isError } = useQuery({
    queryFn: getUsers,
    queryKey: ["users"],
  });

  if (isFetching) {
    return <div>Loading...</div>;
  }
  if (isError || !data) {
    return <div>Error!</div>;
  }

  const UserRows = data.data.data.map((user) => <UserRow user={user} />);

  return (
    <Table>
      <TableCaption>A list of users using your platform</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{...UserRows}</TableBody>
    </Table>
  );
};

const UserRow = ({ user }: { user: User }) => {
  const {
    id,
    name,
    username,
    email,
    role,
    is_blocked,
    is_subscribed,
    is_verified,
    languages,
    social_links,
    about,
    avatar_url,
    phone_number,
    timezone,
  } = user;
  return (
    <TableRow>
      <TableCell>
        <Avatar>
          <AvatarImage src={avatar_url} />
          <AvatarFallback>{email.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className={cn(name ? "" : "text-muted-foreground")}>
        {name ?? "Not set"}
      </TableCell>
      <TableCell className={cn(username ? "" : "text-muted-foreground")}>
        {username ?? "Not set"}
      </TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>
        <BlockUserButton currentlyBlocked={is_blocked} userId={id} />
      </TableCell>
    </TableRow>
  );
};

const BlockUserButton: React.FC<{
  userId: string;
  currentlyBlocked: boolean;
}> = ({ userId, currentlyBlocked }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    ApiResponseWithMessage,
    ApiErrorResponseType,
    string,
    any
  >({
    mutationFn: currentlyBlocked ? unblockUser : blockUser,
    onMutate() {
      const previousUserData: ApiResponseWithData<User[]> =
        queryClient.getQueryData(["users"])!;
      queryClient.setQueryData(
        ["users"],
        produce(previousUserData, (draft) => {
          draft.data.data.forEach((user) => {
            if (user.id === userId) {
              user.is_blocked = !currentlyBlocked;
            }
          });
        }),
      );
      return { previousUserData };
    },
    onError(_err, _vars, context) {
      queryClient.setQueryData(["users"], context?.previousUserData);
    },
  });

  const handleClick = () => {
    mutate(userId, {
      onSuccess(data) {
        toast.success(data.data.message);
      },
      onError(err) {
        toast.error(err.message);
      },
    });
  };

  return (
    <Button
      variant={currentlyBlocked ? "default" : "destructive"}
      type="button"
      disabled={isPending}
      onClick={handleClick}
    >
      {currentlyBlocked ? "Unblock" : "Block"}
    </Button>
  );
};

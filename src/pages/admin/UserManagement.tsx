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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router";

export const UserManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isVerified, setIsVerified] = useState(
    searchParams.get("isVerified") == "true" ||
      searchParams.get("isVerified") == "false"
      ? Boolean(searchParams.get("isVerified"))
      : undefined,
  );

  const [queryString, setQueryString] = useState(
    searchParams.get("query") ?? "",
  );
  function handleSubmit() {
    setSearchParams({ query: queryString });
  }

  return (
    <div className="">
      <AdminTopBar mainText="User Management" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="p-4"
      >
        <Input
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
          placeholder="Search for users"
        />
      </form>
      <div className="p-4 w-full">
        <UserTable queryString={queryString} isVerified={isVerified} />
      </div>
    </div>
  );
};

type UserFilters = {
  query?: string;
  isVerified?: boolean;
};

export function useUsers(filters: UserFilters, limit = 20) {
  return useInfiniteQuery({
    queryKey: ["users", filters],
    queryFn: async ({ pageParam }: { pageParam: undefined | string }) => {
      return getUsers({
        cursor: pageParam,
        limit,
        filters,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    initialPageParam: undefined, // cursor starts as undefined
  });
}

const UserTable: React.FC<{
  queryString?: string;
  isVerified?: boolean;
}> = ({ queryString, isVerified }) => {
  // const { data, isFetching, isError } = useQuery({
  //   queryFn: () => getUsers,
  //   queryKey: ["users"],
  // });
  //

  const {
    isFetching,
    isPending,
    isError,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useUsers({
    query: queryString,
    isVerified,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError || !data) {
    return <div>Error!</div>;
  }

  const users = data.pages.flatMap((page) => page.data);

  const UserRows = users.map((user) => <UserRow user={user} />);

  return (
    <Table className="w-full">
      <TableCaption>A list of users using your platform</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{...UserRows}</TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>
            <div className="flex justify-center items-center w-full">
              {hasNextPage && (
                <Button
                  variant="outline"
                  className="self-center"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
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
      <TableCell>{is_verified ? "true" : "false"}</TableCell>

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

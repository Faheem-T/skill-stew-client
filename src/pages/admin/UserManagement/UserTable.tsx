import { useUsers } from "@/hooks/useUsers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { BlockUserButton } from "./BlockUserButton";
import type { UserQueryFilters } from "@/types/UserQueryFilters";
import type { User } from "@/api/users/GetUsers";

export const UserTable: React.FC<{
  queryString?: string;
  isVerified?: boolean;
}> = ({ queryString, isVerified }) => {
  const filters = { query: queryString, isVerified };
  const {
    isFetching,
    isPending,
    isError,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useUsers(filters);

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError || !data) {
    return <div>Error!</div>;
  }

  const users = data.pages.flatMap((page) => page.data);

  const UserRows = users.map((user) => (
    <UserRow user={user} filters={filters} />
  ));

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

const UserRow = ({
  user,
  filters,
}: {
  user: User;
  filters: UserQueryFilters;
}) => {
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
        <BlockUserButton
          currentlyBlocked={is_blocked}
          userId={id}
          filters={filters}
        />
      </TableCell>
    </TableRow>
  );
};

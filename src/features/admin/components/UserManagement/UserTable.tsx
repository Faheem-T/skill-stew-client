import { useUsers } from "@/features/admin/hooks/useUsers";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { FetchingState } from "@/shared/components/ui/fetching-state";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { BlockUserButton } from "./BlockUserButton";
import type { UserQueryFilters } from "@/features/admin/types/UserQueryFilters";
import type { User } from "@/features/admin/api/users/GetUsers";

export const UserTable: React.FC<{
  queryString?: string;
  isVerified?: boolean;
}> = ({ queryString, isVerified }) => {
  const filters = { query: queryString, isVerified };
  const {
    isPending,
    isError,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useUsers(filters);

  if (isPending) {
    return <FetchingState label="Loading users" />;
  }
  if (isError || !data) {
    return (
      <div className="bg-card border-border rounded-lg border p-6 text-sm text-muted-foreground">
        Could not load users.
      </div>
    );
  }

  const users = data.pages.flatMap((page) => page.data);
  if (users.length === 0) {
    return (
      <div className="bg-card border-border rounded-lg border p-6 text-sm text-muted-foreground">
        No users found for the current search.
      </div>
    );
  }

  return (
    <div className="bg-card border-border overflow-hidden rounded-lg border">
      <Table className="w-full">
      <TableCaption>A list of users using your platform</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserRow key={user.id} user={user} filters={filters} />
        ))}
      </TableBody>
      {hasNextPage && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              <div className="flex justify-center items-center w-full">
                <Button
                  variant="outline"
                  className="self-center"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
      </Table>
    </div>
  );
};

const UserRow = ({
  user,
  filters,
}: {
  user: User;
  filters: UserQueryFilters;
}) => {
  const { id, username, email, isBlocked, isVerified } = user;
  return (
    <TableRow>
      <TableCell>
        <Avatar>
          <AvatarFallback>{email.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className={cn(username ? "" : "text-muted-foreground")}>
        {username ?? "Not set"}
      </TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{isVerified ? "Yes" : "No"}</TableCell>

      <TableCell>
        <BlockUserButton
          currentlyBlocked={isBlocked}
          userId={id}
          filters={filters}
        />
      </TableCell>
    </TableRow>
  );
};

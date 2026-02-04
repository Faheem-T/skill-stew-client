import { useUsers } from "@/features/admin/hooks/useUsers";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
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
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{...UserRows}</TableBody>
      {hasNextPage && (
        <TableFooter>
          <TableRow>
            <TableCell>
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
  );
};

const UserRow = ({
  user,
  filters,
}: {
  user: User;
  filters: UserQueryFilters;
}) => {
  const { id, username, email, role, isBlocked, isVerified } = user;
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
      <TableCell>{isVerified ? "true" : "false"}</TableCell>

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

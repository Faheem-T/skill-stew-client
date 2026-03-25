import { AdminTopBar } from "@/features/admin/components/layout/AdminTopbar";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { UserTable } from "../components/UserManagement/UserTable";

export const UserManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isVerified] = useState(
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
    <div className="bg-background min-h-screen">
      <AdminTopBar
        mainText="User Management"
        subText="Search user accounts and manage block status."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="mx-auto max-w-[1200px] px-4 py-6 md:px-8"
      >
        <div className="relative max-w-md">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            strokeWidth={1.5}
          />
          <Input
            value={queryString}
            onChange={(e) => setQueryString(e.target.value)}
            placeholder="Search for users"
            className="pl-9"
          />
        </div>
      </form>
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-8 md:px-8">
        <UserTable queryString={queryString} isVerified={isVerified} />
      </div>
    </div>
  );
};

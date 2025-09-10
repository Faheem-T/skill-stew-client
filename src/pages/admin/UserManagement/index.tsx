import { AdminTopBar } from "@/components/custom/AdminTopbar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { UserTable } from "./UserTable";

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

import { getUsers } from "@/api/users/GetUsers";
import { useQuery } from "@tanstack/react-query";

export const UserManagement = () => {
  return (
    <div>
      <UserTable />
    </div>
  );
};

const UserTable = () => {
  const { data, isFetching, isError } = useQuery({
    queryFn: getUsers,
    queryKey: ["users"],
  });

  if (isFetching) {
    return <div> Loading...</div>;
  }
  if (isError) {
    return <div>Error!</div>;
  }

  console.log(data);

  return <div>Data received</div>;
};

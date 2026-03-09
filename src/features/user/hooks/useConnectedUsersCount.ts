import { useQuery } from "@tanstack/react-query";
import { getConnectedUsersCount } from "../api/GetConnectedUsersCount";

export const CONNECTED_USERS_COUNT_QUERY_KEY = "connected-users-count";

export const useConnectedUsersCount = (userId: string | undefined) => {
  return useQuery({
    queryKey: [CONNECTED_USERS_COUNT_QUERY_KEY, userId],
    queryFn: () => getConnectedUsersCount({ userId: userId! }),
    enabled: !!userId,
  });
};

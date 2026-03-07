import { useInfiniteQuery } from "@tanstack/react-query";
import { getConnectedUsers } from "../api/GetConnectedUsers";

export const CONNECTED_USERS_QUERY_KEY = "connected-users";

export const useConnectedUsers = (
  userId: string | undefined,
  limit: number = 20,
) => {
  return useInfiniteQuery({
    queryKey: [CONNECTED_USERS_QUERY_KEY, userId],
    queryFn: ({ pageParam }) =>
      getConnectedUsers({ userId: userId!, limit, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!userId,
  });
};

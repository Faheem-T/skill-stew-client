import { getUsers } from "@/api/users/GetUsers";
import type { UserQueryFilters } from "@/types/UserQueryFilters";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useUsers(filters: UserQueryFilters, limit = 20) {
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

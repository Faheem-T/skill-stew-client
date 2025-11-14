import { getUsers } from "@/features/admin/api/users/GetUsers";
import type { UserQueryFilters } from "@/features/admin/types/UserQueryFilters";
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

import { getNotificationsRequest } from "@/features/notification/api/GetNotifications";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useNotifications(limit = 15) {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam }: { pageParam: undefined | string }) => {
      return getNotificationsRequest({
        cursor: pageParam,
        limit,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    initialPageParam: undefined,
  });
}

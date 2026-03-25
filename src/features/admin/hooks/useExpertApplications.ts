import { getExpertApplications } from "@/features/admin/api/experts/GetExpertApplications";
import type { ExpertApplicationQueryFilters } from "@/features/admin/types/ExpertApplicationQueryFilters";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useExpertApplications(
  filters: ExpertApplicationQueryFilters,
  limit = 20,
) {
  return useInfiniteQuery({
    queryKey: ["expert-applications", filters],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      return getExpertApplications({
        cursor: pageParam,
        limit,
        filters,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    initialPageParam: undefined,
  });
}


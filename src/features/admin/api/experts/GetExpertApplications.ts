import { api, type PaginatedApiResponse } from "@/shared/api/baseApi";
import type { ExpertApplicationQueryFilters } from "@/features/admin/types/ExpertApplicationQueryFilters";
import type { ExpertApplicationListItem } from "../../types/ExpertApplication";

export const getExpertApplications = async ({
  cursor,
  limit,
  filters,
}: {
  cursor?: string;
  limit: number;
  filters?: ExpertApplicationQueryFilters;
}): Promise<PaginatedApiResponse<ExpertApplicationListItem[]>> => {
  return api.get("/expert-applications", {
    params: { cursor, limit, status: filters?.status },
  });
};

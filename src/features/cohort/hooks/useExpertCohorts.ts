import { useQuery } from "@tanstack/react-query";
import { getExpertCohortsRequest } from "@/features/cohort/api/cohorts";
import type { CohortListItem, CohortStatus } from "@/features/cohort/types/types";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";

export const EXPERT_COHORTS_QUERY_KEY = "expert-cohorts";

export const useExpertCohorts = (filters?: {
  workshopId?: string;
  status?: CohortStatus;
}) => {
  return useQuery<CohortListItem[], ApiErrorResponseType>({
    queryKey: [EXPERT_COHORTS_QUERY_KEY, filters?.workshopId ?? null, filters?.status ?? null],
    queryFn: async () => {
      const response = await getExpertCohortsRequest(filters);
      return response.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

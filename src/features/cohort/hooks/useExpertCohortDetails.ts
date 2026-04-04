import { useQuery } from "@tanstack/react-query";
import { getExpertCohortDetailsRequest } from "@/features/cohort/api/cohorts";
import type { CohortDetails } from "@/features/cohort/types/types";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";

export const EXPERT_COHORT_DETAILS_QUERY_KEY = "expert-cohort";

export const useExpertCohortDetails = (id: string, enabled = true) => {
  return useQuery<CohortDetails, ApiErrorResponseType>({
    queryKey: [EXPERT_COHORT_DETAILS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getExpertCohortDetailsRequest(id);
      return response.data;
    },
    enabled: Boolean(id) && enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

import { useQuery } from "@tanstack/react-query";
import { getExpertCohortMembersRequest } from "@/features/cohort/api/cohorts";
import type { CohortMember } from "@/features/cohort/types/types";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";

export const EXPERT_COHORT_MEMBERS_QUERY_KEY = "expert-cohort-members";

export const useExpertCohortMembers = (id: string, enabled = true) => {
  return useQuery<CohortMember[], ApiErrorResponseType>({
    queryKey: [EXPERT_COHORT_MEMBERS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getExpertCohortMembersRequest(id);
      return response.data;
    },
    enabled: Boolean(id) && enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

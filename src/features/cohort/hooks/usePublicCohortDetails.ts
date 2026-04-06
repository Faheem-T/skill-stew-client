import { useQuery } from "@tanstack/react-query";
import { getPublicCohortDetailsRequest } from "@/features/cohort/api/publicCohorts";
import type { PublicCohortDetails } from "@/features/cohort/types/types";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";

export const PUBLIC_COHORT_DETAILS_QUERY_KEY = "public-cohort";

export const usePublicCohortDetails = (id: string) => {
  return useQuery<PublicCohortDetails, ApiErrorResponseType>({
    queryKey: [PUBLIC_COHORT_DETAILS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getPublicCohortDetailsRequest(id);
      return response.data;
    },
    enabled: Boolean(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

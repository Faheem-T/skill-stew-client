import { useQuery } from "@tanstack/react-query";
import { getWorkshopDetailsRequest } from "@/features/workshop/api/getWorkshopDetails";
import type { Workshop } from "@/features/workshop/types/types";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";

export const EXPERT_WORKSHOP_DETAILS_QUERY_KEY = "expert-workshop";

export const useExpertWorkshopDetails = (id: string, enabled: boolean = true) => {
  return useQuery<Workshop, ApiErrorResponseType>({
    queryKey: [EXPERT_WORKSHOP_DETAILS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getWorkshopDetailsRequest(id);
      return response.data;
    },
    enabled: Boolean(id) && enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

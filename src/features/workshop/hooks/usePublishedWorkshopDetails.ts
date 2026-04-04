import { useQuery } from "@tanstack/react-query";
import { getPublishedWorkshopDetailsRequest } from "@/features/workshop/api/getPublishedWorkshopDetails";
import type { PublishedWorkshopDetails } from "@/features/workshop/types/types";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";

export const PUBLISHED_WORKSHOP_DETAILS_QUERY_KEY = "published-workshop";

export const usePublishedWorkshopDetails = (id: string) => {
  return useQuery<PublishedWorkshopDetails, ApiErrorResponseType>({
    queryKey: [PUBLISHED_WORKSHOP_DETAILS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getPublishedWorkshopDetailsRequest(id);
      return response.data;
    },
    enabled: Boolean(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

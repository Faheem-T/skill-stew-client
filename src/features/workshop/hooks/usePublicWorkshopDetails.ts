import { useQuery } from "@tanstack/react-query";
import { getPublicWorkshopDetailsRequest } from "@/features/workshop/api/getPublicWorkshopDetails";
import type { PublicWorkshopDetails } from "@/features/workshop/types/types";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";

export const PUBLIC_WORKSHOP_DETAILS_QUERY_KEY = "public-workshop";

export const usePublicWorkshopDetails = (id: string) => {
  return useQuery<PublicWorkshopDetails, ApiErrorResponseType>({
    queryKey: [PUBLIC_WORKSHOP_DETAILS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getPublicWorkshopDetailsRequest(id);
      return response.data;
    },
    enabled: Boolean(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

import { useQuery } from "@tanstack/react-query";
import { getWorkshopsRequest } from "@/features/workshop/api/getWorkshops";
import type { WorkshopListItem, WorkshopStatus } from "@/features/workshop/types/types";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";

export const EXPERT_WORKSHOPS_QUERY_KEY = "expert-workshops";

export const useExpertWorkshops = (status: WorkshopStatus) => {
  return useQuery<WorkshopListItem[], ApiErrorResponseType>({
    queryKey: [EXPERT_WORKSHOPS_QUERY_KEY, status],
    queryFn: async () => {
      const response = await getWorkshopsRequest(status);
      return response.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

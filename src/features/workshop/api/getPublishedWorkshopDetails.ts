import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { PublishedWorkshopDetails } from "@/features/workshop/types/types";

export const getPublishedWorkshopDetailsRequest = async (id: string) => {
  return api.get<string, ApiResponseWithData<PublishedWorkshopDetails>>(
    `/workshops/${id}`,
  );
};

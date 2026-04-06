import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { PublicWorkshopDetails } from "@/features/workshop/types/types";

export const getPublicWorkshopDetailsRequest = async (id: string) => {
  return api.get<string, ApiResponseWithData<PublicWorkshopDetails>>(
    `/public/workshops/${id}`,
  );
};

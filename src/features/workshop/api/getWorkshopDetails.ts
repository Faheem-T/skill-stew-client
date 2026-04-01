import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { Workshop } from "@/features/workshop/types/types";

export const getWorkshopDetailsRequest = async (id: string) => {
  return api.get<string, ApiResponseWithData<Workshop>>(`/workshops/${id}`);
};

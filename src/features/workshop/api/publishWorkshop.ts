import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { Workshop } from "@/features/workshop/types/types";

export const publishWorkshopRequest = async (
  workshopId: string,
): Promise<ApiResponseWithData<Workshop>> => {
  return api.post(`/workshops/${workshopId}/publish`, {});
};

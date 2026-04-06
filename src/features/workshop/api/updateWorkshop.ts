import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { Workshop } from "@/features/workshop/types/types";

export type UpdateWorkshopBody = Partial<{
  title: string;
  description: string;
  targetAudience: string;
  maxCohortSize: number;
  bannerImageKey: string | null;
}>;

export const updateWorkshopRequest = async (
  workshopId: string,
  body: UpdateWorkshopBody,
): Promise<ApiResponseWithData<Workshop>> => {
  return api.patch(`/workshops/${workshopId}`, body);
};

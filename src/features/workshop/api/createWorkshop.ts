import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { Workshop } from "@/features/workshop/types/types";

export type CreateWorkshopBody = {
  title: string;
  description?: string;
  targetAudience?: string;
  maxCohortSize: number;
  bannerImageKey?: string | null;
};

export const createWorkshopRequest = async (
  body: CreateWorkshopBody,
): Promise<ApiResponseWithData<Workshop>> => {
  return api.post("/workshops", body);
};

import { api, type ApiResponseWithData } from "@/shared/api/baseApi";
import type { ExpertApplicationDetails } from "@/features/admin/types/ExpertApplication";

export const getExpertApplicationDetails = async (
  id: string,
): Promise<ApiResponseWithData<ExpertApplicationDetails>> => {
  return api.get(`/experts/applications/${id}`);
};

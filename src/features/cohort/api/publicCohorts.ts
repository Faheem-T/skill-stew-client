import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { PublicCohortDetails } from "@/features/cohort/types/types";

export const getPublicCohortDetailsRequest = async (id: string) => {
  return api.get<string, ApiResponseWithData<PublicCohortDetails>>(
    `/public/cohorts/${id}`,
  );
};

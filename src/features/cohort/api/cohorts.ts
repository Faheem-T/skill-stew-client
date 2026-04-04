import { api } from "@/shared/api/baseApi";
import type {
  ApiResponseType,
  ApiResponseWithData,
  ApiResponseWithMessage,
} from "@/shared/api/baseApi";
import type {
  CohortDetails,
  CohortEnrollmentResponse,
  CohortListItem,
  CohortMember,
  CohortStatus,
  CreateCohortRequest,
  UpdateCohortRequest,
} from "@/features/cohort/types/types";

export const getExpertCohortsRequest = async (params?: {
  workshopId?: string;
  status?: CohortStatus;
}) => {
  return api.get<string, ApiResponseWithData<CohortListItem[]>>("/cohorts", {
    params,
  });
};

export const getExpertCohortDetailsRequest = async (id: string) => {
  return api.get<string, ApiResponseWithData<CohortDetails>>(`/cohorts/${id}`);
};

export const createCohortRequest = async (body: CreateCohortRequest) => {
  return api.post<string, ApiResponseWithData<CohortDetails>>("/cohorts", body);
};

export const updateCohortRequest = async (
  id: string,
  body: UpdateCohortRequest,
) => {
  return api.patch<string, ApiResponseWithData<CohortDetails>>(
    `/cohorts/${id}`,
    body,
  );
};

export const deleteCohortRequest = async (id: string) => {
  return api.delete<string, ApiResponseWithMessage>(`/cohorts/${id}`);
};

export const getExpertCohortMembersRequest = async (id: string) => {
  return api.get<string, ApiResponseWithData<CohortMember[]>>(
    `/cohorts/${id}/members`,
  );
};

export const enrollInCohortRequest = async (id: string) => {
  return api.post<string, ApiResponseWithData<CohortEnrollmentResponse>>(
    `/cohorts/${id}/enrollments`,
  );
};

export const getExpertCohortListFallback = (): ApiResponseType => ({
  success: true,
});

import { api, type ApiResponseWithMessage } from "@/shared/api/baseApi";

export const approveExpertApplication = (
  applicationId: string,
): Promise<ApiResponseWithMessage> => {
  return api.patch(`/expert-applications/${applicationId}/approve`);
};

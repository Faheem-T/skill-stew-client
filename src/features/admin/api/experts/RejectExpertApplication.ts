import { api, type ApiResponseWithMessage } from "@/shared/api/baseApi";

export const rejectExpertApplication = (
  applicationId: string,
  rejectionReason: string,
): Promise<ApiResponseWithMessage> => {
  return api.patch(`/expert-applications/${applicationId}/reject`, {
    rejectionReason,
  });
};

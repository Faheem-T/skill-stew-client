import { api, type ApiResponseWithMessage } from "@/shared/api/baseApi";

export const blockUser = (id: string): Promise<ApiResponseWithMessage> => {
  return api.patch(`/users/${id}/block`);
};


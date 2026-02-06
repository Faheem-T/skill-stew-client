import { api, type ApiResponseWithMessage } from "@/shared/api/baseApi";

export const updateUserBlockStatus = (
  id: string,
  newBlockStatus: boolean,
): Promise<ApiResponseWithMessage> => {
  return api.patch(`/users/${id}/block-status`, {
    newBlockStatus,
  });
};

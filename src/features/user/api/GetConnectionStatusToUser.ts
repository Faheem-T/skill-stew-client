import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { UserConnectionStatus } from "@/shared/constants/UserConnectionStatus";

export interface ConnectionStatusToUserResponse {
  connectionId: string;
  status:
    | UserConnectionStatus
    | "CURRENT_USER_REQUESTING"
    | "REJECTED_BY_TARGET_USER"
    | "NONE";
}

export const getUserConnectionStatusToUser = async ({
  targetId,
}: {
  targetId: string;
}): Promise<ApiResponseWithData<ConnectionStatusToUserResponse>> => {
  return api.get(`connections/status/${targetId}`);
};

import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";

export type ConnectionStatusToUserResponse =
  | {
      connectionId: string;
      status: "CONNECTED" | "PENDING_SENT" | "PENDING_RECEIVED";
    }
  | { connectionId: null; status: "NONE" };

export const getUserConnectionStatusToUser = async ({
  targetId,
}: {
  targetId: string;
}): Promise<ApiResponseWithData<ConnectionStatusToUserResponse>> => {
  return api.get(`connections/status/${targetId}`);
};

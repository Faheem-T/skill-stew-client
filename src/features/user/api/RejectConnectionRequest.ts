import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithMessage } from "@/shared/api/baseApi";

export const rejectConnectionRequest = async ({
  connectionId,
}: {
  connectionId: string;
}): Promise<ApiResponseWithMessage> => {
  return api.patch(`connections/${connectionId}/reject`);
};

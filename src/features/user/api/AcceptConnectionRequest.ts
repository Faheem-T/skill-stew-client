import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithMessage } from "@/shared/api/baseApi";

export const acceptConnectionRequest = async ({
  connectionId,
}: {
  connectionId: string;
}): Promise<ApiResponseWithMessage> => {
  return api.patch(`connections/${connectionId}/accept`);
};

import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithMessage } from "@/shared/api/baseApi";

export const sendConnectionRequest = async ({
  userId,
}: {
  userId: string;
}): Promise<ApiResponseWithMessage> => {
  return api.post(`connections/${userId}`);
};

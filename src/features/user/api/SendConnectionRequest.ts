import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";

export const sendConnectionRequest = async ({
  userId,
}: {
  userId: string;
}): Promise<
  ApiResponseWithData<{ connectionStatus: "PENDING" | "ACCEPTED" }>
> => {
  return api.post(`connections/${userId}`);
};

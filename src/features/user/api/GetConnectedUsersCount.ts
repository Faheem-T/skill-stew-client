import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";

interface GetConnectedUsersCountResponse {
  count: number;
}

export const getConnectedUsersCount = async ({
  userId,
}: {
  userId: string;
}): Promise<ApiResponseWithData<GetConnectedUsersCountResponse>> => {
  return api.get(`connections/${userId}/connected-users/count`);
};

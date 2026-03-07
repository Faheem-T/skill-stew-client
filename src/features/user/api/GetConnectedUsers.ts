import { api } from "@/shared/api/baseApi";
import type { PaginatedApiResponse } from "@/shared/api/baseApi";

interface ConnectedUserListItemDTO {
  id: string;
  username: string | null;
  avatarUrl: string | null;
  connectedAt: Date;
}

export const getConnectedUsers = async ({
  userId,
  limit,
  cursor,
}: {
  userId: string;
  limit: number;
  cursor?: string;
}): Promise<PaginatedApiResponse<ConnectedUserListItemDTO[]>> => {
  return api.get(`connections/${userId}/connected-users`, {
    params: { limit, cursor },
  });
};

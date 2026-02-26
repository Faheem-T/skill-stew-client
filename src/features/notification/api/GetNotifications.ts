import { api } from "@/shared/api/baseApi";
import type { PaginatedApiResponse } from "@/shared/api/baseApi";
import type { Notification } from "@/features/notification/types/types";

export const getNotificationsRequest = async ({
  cursor,
  limit,
}: {
  cursor?: string;
  limit?: number;
}): Promise<PaginatedApiResponse<Notification[]>> => {
  return api.get("notifications", {
    params: { cursor, limit },
  });
};

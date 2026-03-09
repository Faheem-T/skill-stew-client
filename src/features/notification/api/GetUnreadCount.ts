import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";

export const getUnreadCountRequest = async (): Promise<
  ApiResponseWithData<{ count: number }>
> => {
  return api.get("notifications/unread-count");
};

import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { Notification } from "@/features/notification/types/types";

export const getNotificationsRequest = async (): Promise<
  ApiResponseWithData<Notification[]>
> => {
  return api.get("notifications");
};

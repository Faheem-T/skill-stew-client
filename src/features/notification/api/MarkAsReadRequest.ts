import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";
import type { Notification } from "../types/types";

export const markAsReadRequest = async (
  id: string,
): Promise<ApiResponseWithData<Notification>> => {
  return api.patch(`notifications/${id}/read`);
};

import { api, type ApiResponseType } from "@/shared/api/baseApi";

export const logoutRequest = async (): Promise<ApiResponseType> => {
  return api.post("/auth/logout");
};

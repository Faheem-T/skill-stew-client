import { api, type ApiResponseType } from "../baseApi";

export const logoutRequest = async (): Promise<ApiResponseType> => {
  return api.post("/auth/logout");
};

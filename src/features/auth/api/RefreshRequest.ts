import { api, type ApiResponseWithData } from "@/shared/api/baseApi";

export const refreshRequest = (): Promise<
  ApiResponseWithData<{ accessToken: string }>
> => {
  return api.post("/auth/refresh");
};


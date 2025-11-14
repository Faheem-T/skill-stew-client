import { api, type ApiResponseWithData } from "@/shared/api/baseApi";

export const googleAuth = async (
  credential: string,
): Promise<ApiResponseWithData<{ accessToken: string }>> => {
  return api.post("/auth/google-auth", { credential });
};

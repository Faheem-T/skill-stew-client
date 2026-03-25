import { api, type ApiResponseWithMessage } from "@/shared/api/baseApi";

export type ExpertRegisterRequestBody = {
  email: string;
  password: string;
};

export const expertRegisterRequest = async (
  body: ExpertRegisterRequestBody,
): Promise<ApiResponseWithMessage> => {
  return api.post("/auth/experts/register", body);
};

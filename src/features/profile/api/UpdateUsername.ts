import { api, type ApiResponseWithMessage } from "@/shared/api/baseApi";

export const updateUsernameRequest = async (username: string): Promise<ApiResponseWithMessage> => {
  return api.patch("/me/username", { username });
};
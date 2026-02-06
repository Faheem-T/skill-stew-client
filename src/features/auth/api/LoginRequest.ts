import type { loginSchema } from "@/features/auth/pages/LoginPage";
import { api, type ApiResponseWithData } from "@/shared/api/baseApi";
import { z } from "zod";

export const loginRequest = async (
  body: z.infer<typeof loginSchema>,
): Promise<ApiResponseWithData<{ accessToken: string }>> => {
  return api.post("/auth/login", body);
};

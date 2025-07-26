import type { loginSchema } from "@/pages/LoginPage";
import { api, type ApiResponseWithData } from "../baseApi";
import { z } from "zod";

export const loginRequest = async (
  body: z.infer<typeof loginSchema>,
): Promise<ApiResponseWithData<{ accessToken: string }>> => {
  return api.post("/auth/login", body);
};

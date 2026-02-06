import { adminLoginSchema } from "@/features/admin/pages/AdminLogin";
import { api, type ApiResponseWithData } from "@/shared/api/baseApi";
import { z } from "zod";

export const adminLoginRequest = async (
  body: z.infer<typeof adminLoginSchema>,
): Promise<ApiResponseWithData<{ accessToken: string }>> => {
  return api.post("/auth/admin/login", body);
};

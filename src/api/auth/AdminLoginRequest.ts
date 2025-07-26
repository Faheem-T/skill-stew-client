import { adminLoginSchema } from "@/pages/admin/AdminLogin";
import { api, type ApiResponseWithData } from "../baseApi";
import { z } from "zod";

export const adminLoginRequest = async (
  body: z.infer<typeof adminLoginSchema>,
): Promise<ApiResponseWithData<{ accessToken: string }>> => {
  return api.post("/auth/admin/login", body);
};

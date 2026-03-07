import { api, type ApiResponseWithData } from "@/shared/api/baseApi";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string(),
});

export const loginRequest = async (
  body: z.infer<typeof loginSchema>,
): Promise<ApiResponseWithData<{ accessToken: string }>> => {
  return api.post("/auth/login", body);
};

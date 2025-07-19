import type { loginSchema } from "@/pages/LoginPage";
import { api, type ApiResponseType } from "../baseApi";
import { z } from "zod";

export const loginRequest = async (
  body: z.infer<typeof loginSchema>,
): Promise<ApiResponseType<{}>> => {
  return api.post("/auth/login", body);
};


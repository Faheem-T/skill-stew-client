import type { registerSchema } from "@/pages/RegisterPage";
import { api } from "../baseApi";
import { z } from "zod";
export type RegisterResponseType = { success: true; message: string };

export type RegisterErrorResponseType = {
  success: false;
  userAlreadyExists: boolean;
  userVerified: boolean;
};

export const registerRequest = async (
  body: z.infer<typeof registerSchema>,
): Promise<RegisterResponseType> => {
  return api.post("/auth/register", body);
};

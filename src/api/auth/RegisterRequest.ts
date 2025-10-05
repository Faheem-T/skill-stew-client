import { api } from "../baseApi";
export type RegisterResponseType = { success: true; message: string };

export type RegisterErrorResponseType = {
  success: false;
  userAlreadyExists: boolean;
};

export const registerRequest = async (body: {
  email: string;
  password: string;
}): Promise<RegisterResponseType> => {
  return api.post("/auth/register", body);
};

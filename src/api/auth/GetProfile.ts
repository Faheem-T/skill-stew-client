import { api, type ApiResponseWithData } from "../baseApi";

type getProfileData =
  | {
      id: string;
      username: string | undefined;
      name: string | undefined;
      email: string;
      role: "USER";
    }
  | { id: string; username: string | undefined; role: "ADMIN" }
  | null;

export const getProfile = async (): Promise<
  ApiResponseWithData<getProfileData>
> => {
  return await api.get("/auth/me");
};

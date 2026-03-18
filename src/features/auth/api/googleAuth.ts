import { api, type ApiResponseWithData } from "@/shared/api/baseApi";

export const googleAuth = async ({
  credential,
  requestedRole,
}: {
  credential: string;
  requestedRole: "USER" | "EXPERT_APPLICANT";
}): Promise<ApiResponseWithData<{ accessToken: string }>> => {
  return api.post("/auth/google-auth", { credential, requestedRole });
};

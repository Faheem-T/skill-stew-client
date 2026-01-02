import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";

export const checkUsernameAvailabilityRequest = async (
  username: string,
): Promise<ApiResponseWithData<{available: boolean}>> => {
  return api.get("/users/username-availability", { params: { username } });
};
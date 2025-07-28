import { api, type ApiResponseWithData } from "../baseApi"

export const refreshRequest = (): Promise<ApiResponseWithData<{accessToken: string}>> => {
    return api.post("/auth/refresh")
}
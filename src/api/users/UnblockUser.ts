import { api, type ApiResponseWithMessage } from "../baseApi"

export const unblockUser = async (id: string): Promise<ApiResponseWithMessage> => {
    return api.patch(`/users/${id}/unblock`)
}
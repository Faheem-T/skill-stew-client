import { api, type ApiResponseWithMessage } from "../baseApi"

export const blockUser = async (id: string): Promise<ApiResponseWithMessage> => {
    return api.patch(`/users/${id}/block`)
}
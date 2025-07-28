import { api, type ApiResponseWithData } from "../baseApi"

interface User {
    id: string;
    role: "USER";
    email: string;
    name?: string;
    username?: string;
    phone_number?: string;
    avatar_url?: string;
    timezone?: string;
    about?: string;
    social_links: string[],
    languages: string[],
    is_subscribed: boolean,
    is_verified: boolean,
    is_blocked: boolean
}

export const getUsers = async (): Promise<ApiResponseWithData<User[]>> => {
    return api.get("/users")
}
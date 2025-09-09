import { api, type ApiResponseWithData, type PaginatedApiResponse } from "../baseApi"

export interface User {
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

type UserFilters = {
  query?: string;
  isVerified?: boolean;
};
export const getUsers = async ({
  cursor,
  limit,
  filters,
}: {
  cursor?: string;
  limit: number;
  filters?: UserFilters;
}):Promise<PaginatedApiResponse<User[]>> => {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  params.append("limit", limit.toString());
  if (filters?.query) params.append("query", filters.query);
  if (filters?.isVerified !== undefined) {
    params.append("isVerified", filters.isVerified.toString());
  }
    const result = await api.get(`/users?${params.toString()}`)
    return result.data
}
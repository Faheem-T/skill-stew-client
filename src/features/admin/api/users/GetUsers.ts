import { api, type PaginatedApiResponse } from "@/shared/api/baseApi";

export interface User {
  id: string;
  role: "USER";
  email: string;
  username?: string;
  isVerified: boolean;
  isBlocked: boolean;
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
}): Promise<PaginatedApiResponse<User[]>> => {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  params.append("limit", limit.toString());
  if (filters?.query) params.append("query", filters.query);
  if (filters?.isVerified !== undefined) {
    params.append("isVerified", filters.isVerified.toString());
  }
  return api.get(`/users?${params.toString()}`);
};

import { useAppStore } from "@/app/store";
import axios from "axios";
import { AxiosError } from "axios";
import { refreshRequest } from "@/features/auth/api/RefreshRequest";

export const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((request) => {
  request.headers.setAuthorization(
    `Bearer ${useAppStore.getState().accessToken}`,
  );
  return request;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error instanceof AxiosError) {
      if (!error.response || !error.config) {
        return Promise.reject(error);
      }

      if (error.response.status === 401) {
        if (error.config.url === "/auth/refresh") {
          useAppStore.getState().logout();
          return Promise.reject(error);
        }
        try {
          const { data } = await refreshRequest();
          useAppStore.getState().setAccessToken(data.accessToken);
          return api.request(error.config);
        } catch (_err) {
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  },
);

export type ApiResponseType = {
  success: true;
  message?: string;
  data?: any;
};

export type ApiResponseWithMessage = {
  success: true;
  message: string;
};

export type ApiResponseWithData<T> = {
  success: true;
  data: T;
  message?: string;
};

export type PaginatedApiResponse<T> = {
  success: true;
  data: T;
  nextCursor: string;
  hasNextPage: boolean;
  message?: string;
};

export type ApiErrorResponseType = AxiosError<{
  success: false;
  message: string;
  error: string;
  errors?: { message: string; field?: string }[];
}>;

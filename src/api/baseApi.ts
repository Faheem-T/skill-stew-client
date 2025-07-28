import { useAppStore } from "@/store";
import axios from "axios";
import { AxiosError, type AxiosResponse } from "axios";
import { refreshRequest } from "./auth/RefreshRequest";


export const api = axios.create({
  baseURL: "https://stew.com/api/v1",
  withCredentials: true,
});

api.interceptors.request.use(request => {
  request.headers.setAuthorization(`Bearer ${useAppStore.getState().accessToken}`)
  return request
})

api.interceptors.response.use(response => response, async (error) => {
  if (error instanceof AxiosError) {
    if (!error.response || !error.config) {
      return Promise.reject(error)
    }

    if (error.response.status === 401){
      console.log(error)
      console.log(error.request)
      if (error.config.url === "/auth/refresh") {
        useAppStore.getState().logout()
      return Promise.reject(error);
      }
      try {
      const {data} = await refreshRequest()
      useAppStore.getState().setAccessToken(data.data.accessToken)
      return api.request(error.config)
      } catch (_err) {
        return Promise.reject(error);
      }

    }
  }
  return Promise.reject(error)
})

export type ApiResponseType = AxiosResponse<{
  success: true;
  message?: string;
  data?: any;
}>;

export type ApiResponseWithMessage = AxiosResponse<{
  success: true;
  message: string;
}>;

export type ApiResponseWithData<T> = AxiosResponse<{
  success: true;
  data: T;
  message?: string;
}>;

export type ApiErrorResponseType = AxiosError<{
  success: false;
  message: string;
  error: string;
  errors?: { error: string; field?: string }[];
}>;

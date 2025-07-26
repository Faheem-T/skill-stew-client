import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: "http://stew.com/api/v1",
  withCredentials: true,
});

export type ApiResponseType = AxiosResponse<{
  success: true;
  message?: string;
  data?: any;
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

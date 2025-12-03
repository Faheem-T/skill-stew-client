import { api } from "@/shared/api/baseApi";
import type { ApiResponseWithData } from "@/shared/api/baseApi";

export type GeneratePresignedUploadUrlBody = {
  type: "avatar" | "banner";
  mimetype: "image/png" | "image/jpeg" | "image/webp";
};

export type GeneratePresignedUploadUrlResponse = {
  uploadUrl: string;
  key: string;
};

export const generatePresignedUploadUrlRequest = async (
  body: GeneratePresignedUploadUrlBody,
): Promise<ApiResponseWithData<GeneratePresignedUploadUrlResponse>> => {
  return api.post("/me/upload/pre-signed", body);
};

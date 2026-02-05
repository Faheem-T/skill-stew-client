import { useState, useCallback } from "react";
import { generatePresignedUploadUrlRequest } from "@/features/onboarding/api/GeneratePresignedUploadUrl";
import type { GeneratePresignedUploadUrlResponse } from "@/features/onboarding/api/GeneratePresignedUploadUrl";
import type { ImageUploadType } from "@/shared/config/imageUploadTypes";

export interface UseUploadToS3Return {
  upload: (file: File, imageType: ImageUploadType) => Promise<string>;
  isUploading: boolean;
  error: Error | null;
}

/**
 * Hook for uploading images to S3 using presigned URLs
 * Handles presigned URL generation and PUT request to S3
 */
export const useUploadToS3 = (): UseUploadToS3Return => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(
    async (file: File, imageType: ImageUploadType): Promise<string> => {
      setIsUploading(true);
      setError(null);

      try {
        const mimetype = file.type as "image/png" | "image/jpeg" | "image/webp";

        const response = await generatePresignedUploadUrlRequest({
          type: imageType as "avatar" | "banner",
          mimetype,
        });

        const presigned: GeneratePresignedUploadUrlResponse = response.data;

        const putRes = await fetch(presigned.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": mimetype,
          },
          body: file,
        });

        if (!putRes.ok) {
          throw new Error("Upload to S3 failed");
        }

        return presigned.key;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return {
    upload,
    isUploading,
    error,
  };
};

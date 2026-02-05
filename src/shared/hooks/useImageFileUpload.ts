import { useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { validateImageFile } from "@/shared/lib/imageValidation";
import type { ImageUploadType } from "@/shared/config/imageUploadTypes";

export interface UseImageFileUploadReturn {
  selectedFile: File | null;
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onPickFile: () => void;
  handleFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUndoSelection: () => void;
}

/**
 * Hook for managing image file selection, preview, and cleanup
 * Handles MIME type validation based on image type configuration
 */
export const useImageFileUpload = (
  imageType: ImageUploadType,
): UseImageFileUploadReturn => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onPickFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validation = validateImageFile(file, imageType);
      if (!validation.valid) {
        toast.error(validation.error || "Invalid image file");
        return;
      }

      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    },
    [imageType],
  );

  const handleUndoSelection = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  return {
    selectedFile,
    previewUrl,
    fileInputRef,
    onPickFile,
    handleFileSelected,
    handleUndoSelection,
  };
};

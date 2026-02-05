import { IMAGE_UPLOAD_TYPES } from "@/shared/config/imageUploadTypes";
import type { ImageUploadType } from "@/shared/config/imageUploadTypes";

interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates that a file is an accepted image type
 */
export const validateImageFile = (
  file: File,
  imageType: ImageUploadType,
): ValidationResult => {
  const config = IMAGE_UPLOAD_TYPES[imageType];

  if (!config.acceptedMimeTypes.includes(file.type)) {
    const formats = config.acceptedMimeTypes
      .map((mime) => mime.split("/")[1].toUpperCase())
      .join(", ");
    return {
      valid: false,
      error: `Please select a ${formats} image.`,
    };
  }

  return { valid: true };
};

/**
 * Configuration for image upload types
 * Define new image types here when adding support for banners, covers, etc.
 */

export type ImageUploadType = "avatar" | "banner";

interface ImageTypeConfig {
  acceptedMimeTypes: string[];
}

export const IMAGE_UPLOAD_TYPES: Record<ImageUploadType, ImageTypeConfig> = {
  avatar: {
    acceptedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
  },
  banner: {
    acceptedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
  },
};

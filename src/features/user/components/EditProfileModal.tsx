import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import toast from "react-hot-toast";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { ProfileAvatar } from "@/features/onboarding/components/ProfileAvatar";
import { generatePresignedUploadUrlRequest } from "@/features/onboarding/api/GeneratePresignedUploadUrl";
import type { CurrentUserProfile } from "@/shared/api/currentUserProfile";
import { EditProfileFormFields } from "./EditProfileFormFields";
import { X, Upload } from "lucide-react";

const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || isValidPhoneNumber(val),
      "Please enter a valid phone number",
    ),
  about: z.string().max(500).optional(),
  timezone: z.string().optional(),
  location: z.object({ placeId: z.string() }).optional(),
  languages: z.array(z.string()),
  socialLinks: z.array(z.string().url("Must be a valid URL")),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: CurrentUserProfile & { role: "USER" };
}

export const EditProfileModal = ({
  open,
  onOpenChange,
  profile,
}: EditProfileModalProps) => {
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);
  const bannerFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null,
  );
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);

  const mutation = useUpdateProfile();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: profile.name || "",
      phoneNumber: profile.phoneNumber || "",
      about: profile.about || "",
      timezone: profile.timezone || "",
      location: profile.location
        ? { placeId: profile.location.placeId }
        : undefined,
      languages: profile.languages || [],
      socialLinks: profile.socialLinks || [],
    },
  });

  // Reset form when profile changes or modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: profile.name || "",
        phoneNumber: profile.phoneNumber || "",
        about: profile.about || "",
        timezone: profile.timezone || "",
        location: profile.location
          ? { placeId: profile.location.placeId }
          : undefined,
        languages: profile.languages || [],
        socialLinks: profile.socialLinks || [],
      });
    }
  }, [open, profile, form]);

  const handleAvatarSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimetype = file.type;
    if (!["image/png", "image/jpeg", "image/webp"].includes(mimetype)) {
      toast.error("Please select a PNG, JPEG, or WEBP image.");
      return;
    }

    setSelectedAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(previewUrl);
  };

  const handleBannerSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimetype = file.type;
    if (!["image/png", "image/jpeg", "image/webp"].includes(mimetype)) {
      toast.error("Please select a PNG, JPEG, or WEBP image.");
      return;
    }

    setSelectedBannerFile(file);
    const previewUrl = URL.createObjectURL(file);
    setBannerPreviewUrl(previewUrl);
  };

  const handleUndoAvatarSelection = () => {
    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    setSelectedAvatarFile(null);
    setAvatarPreviewUrl(null);
    if (avatarFileInputRef.current) avatarFileInputRef.current.value = "";
  };

  const handleUndoBannerSelection = () => {
    if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl);
    setSelectedBannerFile(null);
    setBannerPreviewUrl(null);
    if (bannerFileInputRef.current) bannerFileInputRef.current.value = "";
  };

  const uploadFile = async (file: File, type: "avatar" | "banner") => {
    const mimetype = file.type as "image/png" | "image/jpeg" | "image/webp";
    const response = await generatePresignedUploadUrlRequest({
      type,
      mimetype,
    });
    const { data } = response;

    const putRes = await fetch(data.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": mimetype },
      body: file,
    });

    if (!putRes.ok) throw new Error("Upload failed");
    return data.key;
  };

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      setIsUploading(true);

      let avatarKey: string | undefined;
      let bannerKey: string | undefined;

      if (selectedAvatarFile) {
        avatarKey = await uploadFile(selectedAvatarFile, "avatar");
      }

      if (selectedBannerFile) {
        bannerKey = await uploadFile(selectedBannerFile, "banner");
      }

      mutation.mutate(
        {
          name: values.name,
          phoneNumber: values.phoneNumber,
          about: values.about,
          timezone: values.timezone,
          location: values.location,
          languages: values.languages,
          socialLinks: values.socialLinks,
          ...(avatarKey && { avatarKey }),
          ...(bannerKey && { bannerKey }),
        },
        {
          onSuccess() {
            toast.success("Profile updated successfully!");
            onOpenChange(false);
            // Clean up preview URLs
            if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
            if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl);
          },
          onError() {
            toast.error("Failed to update profile. Please try again.");
          },
        },
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-stone-900">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Profile Banner
              </label>
              <div className="relative h-32 rounded-lg overflow-hidden bg-primary border border-stone-200">
                {bannerPreviewUrl || profile.bannerUrl ? (
                  <>
                    <img
                      src={bannerPreviewUrl || profile.bannerUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                    {bannerPreviewUrl && (
                      <button
                        type="button"
                        onClick={handleUndoBannerSelection}
                        className="absolute top-2 right-2 p-1.5 bg-stone-900/70 hover:bg-stone-900 text-white rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-white/50 mx-auto mb-2" />
                      <p className="text-white/70 text-sm">No banner image</p>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 px-3 py-1.5 bg-stone-900/70 hover:bg-stone-900 text-white rounded-lg text-sm font-medium"
                >
                  {bannerPreviewUrl || profile.bannerUrl ? "Change" : "Upload"}
                </button>
                <input
                  ref={bannerFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleBannerSelected}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Avatar Upload */}
              <div className="md:col-span-1">
                <ProfileAvatar
                  profile={profile}
                  avatarPreviewUrl={avatarPreviewUrl}
                  selectedAvatarFile={selectedAvatarFile}
                  onPickAvatar={() => avatarFileInputRef.current?.click()}
                  handleAvatarSelected={handleAvatarSelected}
                  handleUndoAvatarSelection={handleUndoAvatarSelection}
                  isUploading={isUploading}
                  fileInputRef={avatarFileInputRef}
                />
              </div>

              {/* Form Fields */}
              <div className="md:col-span-2">
                <EditProfileFormFields profile={profile} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending || isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending || isUploading}
                className="bg-primary hover:bg-primary/90"
              >
                {mutation.isPending || isUploading
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

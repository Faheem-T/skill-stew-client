import { useEffect } from "react";
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
import type { CurrentUserProfile } from "@/shared/api/currentUserProfile";
import { EditProfileFormFields } from "./EditProfileFormFields";
import { X, Upload } from "lucide-react";
import { useImageFileUpload } from "@/shared/hooks/useImageFileUpload";
import { useUploadToS3 } from "@/shared/hooks/useUploadToS3";

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
  const mutation = useUpdateProfile();

  // Image upload hooks
  const avatar = useImageFileUpload("avatar");
  const banner = useImageFileUpload("banner");
  const { upload } = useUploadToS3();

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

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      let avatarKey: string | undefined;
      let bannerKey: string | undefined;

      if (avatar.selectedFile) {
        avatarKey = await upload(avatar.selectedFile, "avatar");
      }

      if (banner.selectedFile) {
        bannerKey = await upload(banner.selectedFile, "banner");
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
            if (avatar.previewUrl) URL.revokeObjectURL(avatar.previewUrl);
            if (banner.previewUrl) URL.revokeObjectURL(banner.previewUrl);
          },
          onError() {
            toast.error("Failed to update profile. Please try again.");
          },
        },
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload images. Please try again.");
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
                {banner.previewUrl || profile.bannerUrl ? (
                  <>
                    <img
                      src={banner.previewUrl || profile.bannerUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                    {banner.previewUrl && (
                      <button
                        type="button"
                        onClick={banner.handleUndoSelection}
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
                  onClick={banner.onPickFile}
                  className="absolute bottom-2 right-2 px-3 py-1.5 bg-stone-900/70 hover:bg-stone-900 text-white rounded-lg text-sm font-medium"
                >
                  {banner.previewUrl || profile.bannerUrl ? "Change" : "Upload"}
                </button>
                <input
                  ref={banner.fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={banner.handleFileSelected}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Avatar Upload */}
              <div className="md:col-span-1">
                <ProfileAvatar
                  profile={profile}
                  avatarPreviewUrl={avatar.previewUrl}
                  selectedAvatarFile={avatar.selectedFile}
                  onPickAvatar={avatar.onPickFile}
                  handleAvatarSelected={avatar.handleFileSelected}
                  handleUndoAvatarSelection={avatar.handleUndoSelection}
                  isUploading={false}
                  fileInputRef={avatar.fileInputRef}
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
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

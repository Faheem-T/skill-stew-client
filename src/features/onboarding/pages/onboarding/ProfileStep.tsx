import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { CURRENT_USER_PROFILE_QUERY_KEY } from "@/shared/hooks/useCurrentUserProfile";
import { Form } from "@/shared/components/ui/form";
import type { OnboardingUpdateProfileBody } from "@/features/onboarding/api/OnboardingUpdateProfile";
import { onboardingUpdateProfileRequest } from "@/features/onboarding/api/OnboardingUpdateProfile";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useUserProfile } from "@/shared/hooks/useUserProfile";
import { generatePresignedUploadUrlRequest } from "../../api/GeneratePresignedUploadUrl";
import type { GeneratePresignedUploadUrlResponse } from "../../api/GeneratePresignedUploadUrl";
import { checkUsernameAvailabilityRequest } from "@/features/onboarding/api/CheckUsernameAvailability";
import { updateUsernameRequest } from "@/features/onboarding/api/UpdateUsername";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";
import { DevTool } from "@hookform/devtools";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { profileSchema } from "@/features/onboarding/schemas";
import type { FormValues } from "@/features/onboarding/schemas";
import { ProfileAvatar } from "@/features/onboarding/components/ProfileAvatar";
import { ProfileFormFields } from "@/features/onboarding/components/ProfileFormFields";

interface ProfileStepProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  onComplete,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [editingLocation, setEditingLocation] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      username: "",
      location: undefined,
      languages: [],
    },
  });
  const { setValue, watch, setError, clearErrors, formState, control } = form;

  // prefilling form with existing profile data
  const { data: profile } = useUserProfile();
  useEffect(() => {
    if (!profile) return;
    if (profile.name) setValue("name", profile.name);
    if (profile.username) setValue("username", profile.username);
    if (profile.languages && profile.languages.length) {
      setValue("languages", profile.languages);
    }
    if (profile.location && profile.location.placeId) {
      setValue("location", { placeId: profile.location.placeId });
    }
  }, [profile, setValue]);

  const watchedUsername = watch("username");
  const debouncedUsername = useDebounce(watchedUsername, 500);

  // Check availability when debounced username changes
  useEffect(() => {
    const checkAvailability = async () => {
      // make sure validation runs first
      await form.trigger("username");

      if (!debouncedUsername) {
        return;
      }

      if (formState.errors.username) {
        return;
      }

      if (debouncedUsername === profile?.username) {
        setIsUsernameAvailable(true);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const { data } =
          await checkUsernameAvailabilityRequest(debouncedUsername);

        if (!data.available) {
          setError("username", {
            type: "manual",
            message: "Username is already taken",
          });
          setIsUsernameAvailable(false);
        } else {
          clearErrors("username");
          // Only show available if it's different from current username
          if (debouncedUsername !== profile?.username) {
            setIsUsernameAvailable(true);
          }
        }
      } catch (error) {
        const err = error as ApiErrorResponseType;
        if (err.response) {
          err.response.data.errors?.forEach(({ message, field }) => {
            console.log(`Field: ${field}, Message: ${message}`);
            if (
              !field ||
              !["username", "name", "languages", "location"].includes(field)
            ) {
              toast.error(message);
              return;
            }

            setError(field as any, { type: "manual", message });
          });
        } else {
          toast.error("Error checking username availability");
        }
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkAvailability();
  }, [debouncedUsername]);

  const navigate = useNavigate();

  const mutation = useMutation<void, unknown, OnboardingUpdateProfileBody>({
    mutationFn: async (body: OnboardingUpdateProfileBody) => {
      await onboardingUpdateProfileRequest(body);
    },
    mutationKey: CURRENT_USER_PROFILE_QUERY_KEY,
  });
  // avatar upload handling
  const onPickAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimetype = file.type as "image/png" | "image/jpeg" | "image/webp";

    if (!["image/png", "image/jpeg", "image/webp"].includes(mimetype)) {
      toast.error("Please select a PNG, JPEG, or WEBP image.");
      return;
    }

    // Stage the file and create preview
    setSelectedAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(previewUrl);
  };

  const handleUndoAvatarSelection = () => {
    // Clean up preview URL
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }
    setSelectedAvatarFile(null);
    setAvatarPreviewUrl(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: FormValues) => {
    console.log("Hello there");
    if (!formState.isDirty && onComplete) {
      console.log("Form is not dirty");
      onComplete();
      return;
    }
    try {
      if (values.username && values.username !== profile?.username) {
        await updateUsernameRequest(values.username);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update username. It might be taken.");
      return;
    }

    let avatarKey: string | undefined;

    // Upload avatar if one was selected
    if (selectedAvatarFile) {
      try {
        setIsUploading(true);
        const mimetype = selectedAvatarFile.type as
          | "image/png"
          | "image/jpeg"
          | "image/webp";

        const response = await generatePresignedUploadUrlRequest({
          type: "avatar",
          mimetype,
        });
        const { data } = response;
        const presigned: GeneratePresignedUploadUrlResponse = data;

        const putRes = await fetch(presigned.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": mimetype,
          },
          body: selectedAvatarFile,
        });

        if (!putRes.ok) {
          throw new Error("Upload failed");
        }

        avatarKey = presigned.key;
      } catch (err) {
        console.error(err);
        toast.error("Failed to upload avatar. Please try again.");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const payload: OnboardingUpdateProfileBody = {
      name: values.name,
      languages: values.languages,
      location: values.location,
      ...(avatarKey && { avatarKey }),
    };

    mutation.mutate(payload, {
      onSuccess() {
        // Clean up preview URL
        if (avatarPreviewUrl) {
          URL.revokeObjectURL(avatarPreviewUrl);
        }
        if (onComplete) {
          onComplete();
        } else {
          navigate("/dashboard");
        }
      },
      onError() {
        toast.error("Failed to update profile. Please try again.");
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1">
            <ProfileAvatar
              profile={profile}
              avatarPreviewUrl={avatarPreviewUrl}
              selectedAvatarFile={selectedAvatarFile}
              onPickAvatar={onPickAvatar}
              handleAvatarSelected={handleAvatarSelected}
              handleUndoAvatarSelection={handleUndoAvatarSelection}
              isUploading={isUploading}
              fileInputRef={fileInputRef}
            />
          </div>

          <div className="md:col-span-2">
            <Form {...form}>
              <form className="grid grid-cols-1 gap-6">
                <ProfileFormFields
                  isCheckingUsername={isCheckingUsername}
                  isUsernameAvailable={isUsernameAvailable}
                  debouncedUsername={debouncedUsername}
                  profile={profile}
                  editingLocation={editingLocation}
                  setEditingLocation={setEditingLocation}
                />
              </form>
            </Form>
            <DevTool control={control} />
          </div>
        </div>
      </div>

      {/* Navigation buttons at bottom */}
      <div className="flex justify-between gap-4 px-8 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
        {onBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6"
          >
            Back
          </Button>
        ) : (
          <Button type="button" variant="outline" disabled className="px-6">
            Back
          </Button>
        )}
        <Button
          type="button"
          disabled={!formState.isValid}
          onClick={form.handleSubmit(onSubmit)}
          className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

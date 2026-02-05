import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { useEffect } from "react";
import { CURRENT_USER_PROFILE_QUERY_KEY } from "@/shared/hooks/useCurrentUserProfile";
import { Form } from "@/shared/components/ui/form";
import type { OnboardingUpdateProfileBody } from "@/features/onboarding/api/OnboardingUpdateProfile";
import { onboardingUpdateProfileRequest } from "@/features/onboarding/api/OnboardingUpdateProfile";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useUserProfile } from "@/shared/hooks/useUserProfile";
import { updateUsernameRequest } from "@/shared/api/UpdateUsername";
import { profileSchema } from "@/features/onboarding/schemas";
import type { FormValues } from "@/features/onboarding/schemas";
import { ProfileAvatar } from "@/features/onboarding/components/ProfileAvatar";
import { ProfileFormFields } from "@/features/onboarding/components/ProfileFormFields";
import { DevTool } from "@hookform/devtools";
import { useImageFileUpload } from "@/shared/hooks/useImageFileUpload";
import { useUploadToS3 } from "@/shared/hooks/useUploadToS3";

interface ProfileStepProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  onComplete,
  onBack,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      username: "",
      location: undefined,
      languages: [],
    },
  });

  const { setValue, formState } = form;
  const { isDirty, isValid } = formState;

  // Prefill form with existing profile data
  const { data: profile } = useUserProfile();
  useEffect(() => {
    if (!profile) return;
    if (profile.name)
      setValue("name", profile.name, {
        shouldDirty: false,
        shouldTouch: false,
      });
    if (profile.username)
      setValue("username", profile.username, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    if (profile.languages && profile.languages.length) {
      setValue("languages", profile.languages, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
    if (profile.location && profile.location.placeId) {
      setValue(
        "location",
        { placeId: profile.location.placeId },
        { shouldDirty: false, shouldTouch: false },
      );
    }
  }, [profile, setValue]);

  // Avatar upload hook
  const avatar = useImageFileUpload("avatar");

  // S3 upload hook
  const { upload } = useUploadToS3();

  // Profile update mutation
  const mutation = useMutation<void, unknown, OnboardingUpdateProfileBody>({
    mutationFn: async (body: OnboardingUpdateProfileBody) => {
      await onboardingUpdateProfileRequest(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
      });
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!isDirty && !!onComplete) {
      onComplete();
      return;
    }

    // Update username if changed
    try {
      if (values.username && values.username !== profile?.username) {
        await updateUsernameRequest(values.username);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update username. It might be taken.");
      return;
    }

    // Upload avatar if selected
    let avatarKey: string | undefined;
    if (avatar.selectedFile) {
      try {
        avatarKey = await upload(avatar.selectedFile, "avatar");
      } catch (err) {
        console.error(err);
        toast.error("Failed to upload avatar. Please try again.");
        return;
      }
    }

    // Submit profile update
    const payload: OnboardingUpdateProfileBody = {
      name: values.name,
      languages: values.languages,
      location: values.location,
      ...(avatarKey && { avatarKey }),
    };

    mutation.mutate(payload, {
      onSuccess() {
        // Clean up preview URL
        if (avatar.previewUrl) {
          URL.revokeObjectURL(avatar.previewUrl);
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
              avatarPreviewUrl={avatar.previewUrl}
              selectedAvatarFile={avatar.selectedFile}
              onPickAvatar={avatar.onPickFile}
              handleAvatarSelected={avatar.handleFileSelected}
              handleUndoAvatarSelection={avatar.handleUndoSelection}
              isUploading={false}
              fileInputRef={avatar.fileInputRef}
            />
          </div>

          <div className="md:col-span-2">
            <Form {...form}>
              <form className="grid grid-cols-1 gap-6">
                <ProfileFormFields profile={profile} />
              </form>
            </Form>
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
          disabled={!isValid}
          onClick={form.handleSubmit(onSubmit)}
          className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Next
        </Button>
      </div>
      <DevTool control={form.control} />
    </div>
  );
};

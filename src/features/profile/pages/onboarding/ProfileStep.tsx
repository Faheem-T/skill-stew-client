import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { CURRENT_USER_PROFILE_QUERY_KEY } from "@/shared/hooks/useCurrentUserProfile";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/shared/components/ui/form";
import { MultiSelect } from "@/shared/components/ui/multi-select";
import type { MultiSelectOption } from "@/shared/components/ui/multi-select";
import type { OnboardingUpdateProfileBody } from "@/features/profile/api/OnboardingUpdateProfile";
import { onboardingUpdateProfileRequest } from "@/features/profile/api/OnboardingUpdateProfile";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import ISO6391 from "iso-639-1";
import { GoogleMapsAutocomplete } from "@/shared/components/ui/google-autocomplete";
import { useUserProfile } from "@/shared/hooks/useUserProfile";
import { generatePresignedUploadUrlRequest } from "../../api/GeneratePresignedUploadUrl";
import type { GeneratePresignedUploadUrlResponse } from "../../api/GeneratePresignedUploadUrl";
import { checkUsernameAvailabilityRequest } from "@/features/profile/api/CheckUsernameAvailability";
import { updateUsernameRequest } from "@/features/profile/api/UpdateUsername";

type FormValues = {
  name?: string;
  username?: string;
  languages?: string[];
  location?: { placeId: string };
};
// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export const ProfileStep = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [editingLocation, setEditingLocation] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, - and _",
      )
      .optional(),
    location: z.object({ placeId: z.string() }).optional(),
    languages: z.array(z.string()).optional(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      username: "",
      location: undefined,
      languages: [],
    },
  });
  const { handleSubmit, control, setValue, watch, setError, clearErrors } =
    form;

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
    if (!debouncedUsername || form.formState.errors.username) {
      clearErrors("username");
      return;
    }

    const checkAvailability = async () => {
      if (debouncedUsername === profile?.username) {
        setIsUsernameAvailable(true);
        return;
      }

      setIsCheckingUsername(true);
      setIsUsernameAvailable(false); // Reset while checking
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
        console.error(error);
        toast.error("Error checking username availability");
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
        toast.success("Profile updated. Onboarding complete.");
        navigate("/dashboard");
      },
      onError() {
        toast.error("Failed to update profile. Please try again.");
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow">
        <CardHeader>
          <h2 className="text-2xl font-bold">Tell us about yourself</h2>
          <p className="text-sm text-muted-foreground">
            This helps others get to know you on the platform.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col items-center md:items-start">
              <div className="mb-4">
                <div
                  className="relative inline-block"
                  onClick={selectedAvatarFile ? undefined : onPickAvatar}
                  role="button"
                  aria-label="Change avatar"
                  title="Change avatar"
                >
                  <Avatar className="w-24 h-24 cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center overflow-hidden">
                    {avatarPreviewUrl ? (
                      <AvatarImage
                        src={avatarPreviewUrl}
                        alt="Avatar preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : profile?.avatarUrl ? (
                      <AvatarImage
                        src={profile.avatarUrl}
                        alt={profile.name ?? profile.username ?? "User"}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <AvatarFallback>U</AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatarSelected}
                />
                {selectedAvatarFile && (
                  <div className="mt-2 flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleUndoAvatarSelection}
                      className="w-full"
                    >
                      Undo Selection
                    </Button>
                  </div>
                )}
                {isUploading && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Uploading...
                  </p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid grid-cols-1 gap-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: Jane Doe" />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input {...field} placeholder="username123" />
                            </div>
                          </FormControl>
                          {isCheckingUsername ? (
                            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground font-medium">
                              Checking...
                            </div>
                          ) : (
                            isUsernameAvailable &&
                            !form.formState.errors.username &&
                            debouncedUsername !== profile?.username && (
                              <div className="flex items-center gap-1 mt-2 text-sm text-green-600 font-medium">
                                <CheckIcon className="w-4 h-4" />
                                <span>Username is available</span>
                              </div>
                            )
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
                    name="location"
                    render={({}) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          {profile?.location?.formattedAddress &&
                          !editingLocation ? (
                            <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded text-sm">
                              <span className="flex-1">
                                {profile.location.formattedAddress}
                              </span>
                              <button
                                type="button"
                                className="p-1 hover:bg-accent rounded transition-colors"
                                aria-label="Edit location"
                                title="Edit location"
                                onClick={() => setEditingLocation(true)}
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <GoogleMapsAutocomplete
                                onPlaceSelected={(place) => {
                                  setValue("location", { placeId: place.id });
                                  setEditingLocation(false);
                                }}
                              />
                              {profile?.location?.formattedAddress && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setEditingLocation(false)}
                                  aria-label="Cancel"
                                  title="Cancel"
                                >
                                  <XIcon className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        </FormControl>
                        <FormDescription>
                          Optional — share your coordinates for local times and
                          discovery.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="languages"
                    render={({ field }) => {
                      const languages: MultiSelectOption[] =
                        ISO6391.getAllCodes().map((code) => ({
                          value: code,
                          label: ISO6391.getName(code),
                        }));

                      return (
                        <FormItem>
                          <FormLabel>Languages</FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={languages}
                              defaultValue={
                                (field.value as string[] | undefined) ?? []
                              }
                              onValueChange={(vals) => field.onChange(vals)}
                              placeholder="Select languages..."
                              maxCount={5}
                              searchable
                              hideSelectAll
                            />
                          </FormControl>
                          <FormDescription>
                            Select one or more languages you speak.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <div className="flex justify-end">
                    <Button type="submit">Save & Continue</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

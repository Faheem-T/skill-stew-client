// no React hooks needed from top-level other than useForm control
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
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
import type { OnboardingUpdateProfileBody } from "@/features/auth/api/OnboardingUpdateProfile";
import { onboardingUpdateProfileRequest } from "@/features/auth/api/OnboardingUpdateProfile";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import ISO6391 from "iso-639-1";

type FormValues = {
  name?: string;
  username?: string;
  languages?: string[];
  location?: { latitude: number; longitude: number };
};

export const ProfileStep = () => {
  const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, - and _")
      .optional(),
    languages: z.array(z.string()).optional(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {},
  });
  const { handleSubmit, control, setValue } = form;
  const [detectingLocation, setDetectingLocation] = useState(false);
  const navigate = useNavigate();
  const mutation = useMutation<void, unknown, OnboardingUpdateProfileBody>({
    mutationFn: async (body: OnboardingUpdateProfileBody) => {
      await onboardingUpdateProfileRequest(body);
    },
  });
  // we skip image uploading for this iteration

  const detectLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not available in this browser.");
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setValue("location", loc, { shouldValidate: true, shouldDirty: true });
        toast.success("Location detected.");
        setDetectingLocation(false);
      },
      (_err) => {
        console.log(_err)
        toast.error("Unable to retrieve location. Please allow location access and try again.");
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const onSubmit = async (values: FormValues) => {
    const payload: OnboardingUpdateProfileBody = {
      name: values.name,
      username: values.username,
      languages: values.languages,
      location: values.location,
    };

    mutation.mutate(payload, {
      onSuccess() {
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
          <p className="text-sm text-muted-foreground">This helps others get to know you on the platform.</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col items-center md:items-start">
              <div className="mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="md:col-span-2">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
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
                            <Input {...field} placeholder="username123" />
                          </FormControl>
                          <FormDescription>Choose a unique handle.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Button type="button" onClick={detectLocation} disabled={detectingLocation}>
                              {detectingLocation ? "Detecting..." : "Detect location"}
                            </Button>
                            <button
                              type="button"
                              onClick={() => setValue("location", undefined)}
                              className="text-sm text-muted-foreground"
                            >
                              Clear
                            </button>
                            {field.value ? (
                              <div className="text-sm text-muted-foreground">
                                Lat: {field.value.latitude.toFixed(4)}, Lng: {field.value.longitude.toFixed(4)}
                              </div>
                            ) : null}
                          </div>
                        </FormControl>
                        <FormDescription>Optional — share your coordinates for local times and discovery.</FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="languages"
                    render={({ field }) => {
                      const languages: MultiSelectOption[] = ISO6391.getAllCodes()
                      .map((code) => ({
                        value: code,
                        label: ISO6391.getName(code), 
                      }));

                      return (
                        <FormItem>
                          <FormLabel>Languages</FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={languages}
                              defaultValue={(field.value as string[] | undefined) ?? []}
                              onValueChange={(vals) => field.onChange(vals)}
                              placeholder="Select languages..."
                              maxCount={5}
                              searchable
                              hideSelectAll
                            />
                          </FormControl>
                          <FormDescription>Select one or more languages you speak.</FormDescription>
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

// Copy of the onboarding profile step to be used for profile completion in the user profile page
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
import type { UpdateProfileBody } from "@/features/profile/api/UpdateProfile";
import { useForm } from "react-hook-form";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import ISO6391 from "iso-639-1";

type FormValues = {
  name?: string;
  username?: string;
  phoneNumber?: string;
  timezone?: string;
  about?: string;
  socialLinks?: string;
  languages?: string[];
};

type UpdatePayload = UpdateProfileBody;

export const ProfileCompletion = () => {
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
    phoneNumber: z.string().min(7, "Enter a valid phone number").optional(),
    timezone: z.string().optional(),
    about: z.string().max(500, "About must be under 500 characters").optional(),
    socialLinks: z.string().optional(),
    languages: z.array(z.string()).optional(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {},
  });
  const { handleSubmit, control } = form;
  const navigate = useNavigate();
  const mutation = useUpdateProfile();
  // we skip image uploading for this iteration

  const onSubmit = async (values: FormValues) => {
    const payload: UpdatePayload = {
      ...values,
      socialLinks: values.socialLinks
        ? values.socialLinks
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
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
          <p className="text-sm text-muted-foreground">
            This helps others get to know you on the platform.
          </p>
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
                            <Input {...field} placeholder="username123" />
                          </FormControl>
                          <FormDescription>
                            Choose a unique handle.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+1 555 555 5555" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="timezone"
                      render={({ field }) => {
                        const tzs: string[] =
                          Intl.supportedValuesOf("timeZone");

                        return (
                          <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full rounded-md border px-3 py-2"
                              >
                                <option value="">Select timezone</option>
                                {tzs.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormDescription>
                              Optional — used to show local times.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <FormField
                    control={control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder="A short bio"
                            className="w-full rounded-md border px-3 py-2 min-h-[96px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Tell people a bit about yourself.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="socialLinks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social links</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              placeholder="One link per line"
                              className="w-full rounded-md border px-3 py-2 min-h-[72px]"
                            />
                          </FormControl>
                          <FormDescription>
                            Optional — add your website or social profiles.
                          </FormDescription>
                          <FormMessage />
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
                  </div>

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

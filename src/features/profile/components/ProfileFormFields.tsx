import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { MultiSelect } from "@/shared/components/ui/multi-select";
import type { MultiSelectOption } from "@/shared/components/ui/multi-select";
import { GoogleMapsAutocomplete } from "@/shared/components/ui/google-autocomplete";
import { Button } from "@/shared/components/ui/button";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import ISO6391 from "iso-639-1";
import { useFormContext } from "react-hook-form";
import type { FormValues } from "../schemas";
import type { UserProfile } from "@/shared/hooks/useUserProfile";

interface ProfileFormFieldsProps {
  isCheckingUsername: boolean;
  isUsernameAvailable: boolean;
  debouncedUsername: string | undefined;
  profile: UserProfile | null | undefined;
  editingLocation: boolean;
  setEditingLocation: (editing: boolean) => void;
}

export const ProfileFormFields = ({
  isCheckingUsername,
  isUsernameAvailable,
  debouncedUsername,
  profile,
  editingLocation,
  setEditingLocation,
}: ProfileFormFieldsProps) => {
  const { control, setValue, formState } = useFormContext<FormValues>();

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Jane Doe"
                  value={field.value || ""}
                />
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
                  <Input
                    {...field}
                    placeholder="username123"
                    value={field.value || ""}
                  />
                </div>
              </FormControl>
              {isCheckingUsername ? (
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground font-medium">
                  Checking...
                </div>
              ) : (
                isUsernameAvailable &&
                field.value?.trim() &&
                !formState.errors.username &&
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
              {profile?.location?.formattedAddress && !editingLocation ? (
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
              Optional — share your coordinates for local times and discovery.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="languages"
        render={({ field }) => {
          const languages: MultiSelectOption[] = ISO6391.getAllCodes().map(
            (code) => ({
              value: code,
              label: ISO6391.getName(code),
            }),
          );

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
              <FormDescription>
                Select one or more languages you speak.
              </FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

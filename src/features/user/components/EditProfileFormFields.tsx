import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { MultiSelect } from "@/shared/components/ui/multi-select";
import type { MultiSelectOption } from "@/shared/components/ui/multi-select";
import TimezoneSelect from "react-timezone-select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "@/shared/components/ui/button";
import { Plus, X, PencilIcon, XIcon } from "lucide-react";
import ISO6391 from "iso-639-1";
import type { CurrentUserProfile } from "@/shared/api/currentUserProfile";
import { MapBoxAutocomplete } from "@/shared/components/ui/mapbox-autocomplete";
import type { EditProfileFormValues } from "./EditProfileModal";
import { ABOUT_MAX_LENGTH } from "./EditProfileForm.constants";

// Create languages array once outside the component
const languages: MultiSelectOption[] = ISO6391.getAllCodes().map((code) => ({
  value: code,
  label: ISO6391.getName(code),
}));
interface EditProfileFormFieldsProps {
  profile: CurrentUserProfile & { role: "USER" };
}

export const EditProfileFormFields = ({
  profile,
}: EditProfileFormFieldsProps) => {
  const { control, watch, setValue } = useFormContext<EditProfileFormValues>();
  const [editingLocation, setEditingLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState<string | null>(null);
  const {
    fields: socialLinkFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const about = watch("about") || "";

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <PhoneInput
                international
                defaultCountry="US"
                value={field.value}
                onChange={field.onChange}
                className="phone-input-container"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="about"
        render={({ field }) => (
          <FormItem>
            <FormLabel>About</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about yourself..."
                className="resize-none h-24"
                {...field}
              />
            </FormControl>
            <FormDescription className="flex justify-between gap-2">
              <span>Tell people a bit about yourself.</span>
              <span>
                {about.length}/{ABOUT_MAX_LENGTH}
              </span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="timezone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Timezone</FormLabel>
            <FormControl>
              <div className="timezone-select">
                <TimezoneSelect
                  value={field.value ?? ""}
                  onChange={(tz) => field.onChange(tz.value)}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              {(field.value?.formattedAddress ||
                profile.location?.formattedAddress) &&
              !editingLocation ? (
                <div className="flex items-center gap-2 py-2 px-3 bg-stone-50 rounded text-sm border border-stone-200">
                  <span className="flex-1">
                    {newLocationName ||
                      profile.location?.formattedAddress ||
                      "Location set"}
                  </span>
                  {newLocationName && (
                    <span className="text-xs text-primary font-medium">
                      (Updated)
                    </span>
                  )}
                  <button
                    type="button"
                    className="p-1 hover:bg-stone-200 rounded transition-colors"
                    onClick={() => {
                      setEditingLocation(true);
                      setNewLocationName(null);
                    }}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MapBoxAutocomplete
                    onPlaceSelected={(location) => {
                      console.log(location);
                      setValue("location", location);
                      setNewLocationName(
                        location.formattedAddress || "New location selected",
                      );
                      setEditingLocation(false);
                    }}
                  />
                  {(field.value?.formattedAddress ||
                    profile.location?.formattedAddress) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingLocation(false)}
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </FormControl>
            <FormDescription>
              Optional — share your location for local times and discovery.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="languages"
        render={({ field }) => (
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
        )}
      />

      <div className="space-y-2">
        <FormLabel>Social Links</FormLabel>
        <FormDescription className="text-xs">
          Add links to your social media profiles or personal website
        </FormDescription>
        <div className="space-y-2">
          {socialLinkFields.map((item, index) => (
            <FormField
              key={item.id}
              control={control}
              name={`socialLinks.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://example.com"
                        className="flex-1"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: "" })}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>
    </div>
  );
};

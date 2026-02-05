import { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/shared/components/ui/form";
import { GoogleMapsAutocomplete } from "@/shared/components/ui/google-autocomplete";
import { Button } from "@/shared/components/ui/button";
import { PencilIcon, XIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { FormValues } from "../../schemas";
import type { UserProfile } from "@/shared/hooks/useUserProfile";

interface LocationFieldProps {
  location: UserProfile["location"] | undefined;
}

export const LocationField = ({ location }: LocationFieldProps) => {
  const { control, setValue } = useFormContext<FormValues>();
  const [editingLocation, setEditingLocation] = useState(false);

  return (
    <FormField
      control={control}
      name="location"
      render={({}) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <FormControl>
            {location?.formattedAddress && !editingLocation ? (
              <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded text-sm">
                <span className="flex-1">{location.formattedAddress}</span>
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
                {location?.formattedAddress && (
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
  );
};

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { MultiSelect } from "@/shared/components/ui/multi-select";
import type { MultiSelectOption } from "@/shared/components/ui/multi-select";
import ISO6391 from "iso-639-1";
import { useFormContext } from "react-hook-form";
import type { FormValues } from "../../schemas";

// Create languages array once outside the component - ISO codes never change
const languages: MultiSelectOption[] = ISO6391.getAllCodes().map((code) => ({
  value: code,
  label: ISO6391.getName(code),
}));

export const LanguagesField = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <FormField
      control={control}
      name="languages"
      render={({ field }) => {
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
  );
};

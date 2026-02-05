import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { CheckIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useUsernameValidation } from "@/shared/hooks/useUsernameValidation";
import { z } from "zod";
import { usernameSchema, profileSchema } from "../../schemas";

// Define the combined form values type
const combinedSchema = usernameSchema.merge(profileSchema);
type CombinedFormValues = z.infer<typeof combinedSchema>;

interface UsernameFieldProps {
  currentUsername?: string;
}

export const UsernameField = ({ currentUsername }: UsernameFieldProps) => {
  const { control, watch, formState, setError, clearErrors } =
    useFormContext<CombinedFormValues>();
  const username = watch("username");
  const { errors, dirtyFields } = formState;

  const { isAvailable, isChecking } = useUsernameValidation({
    username,
    currentUsername,
    setError,
    clearErrors,
    errors: errors,
    isDirty: dirtyFields.username,
  });

  return (
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
                onChange={(e) => field.onChange(e.target.value.toLowerCase())}
              />
            </div>
          </FormControl>
          {isChecking ? (
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground font-medium">
              Checking...
            </div>
          ) : (
            isAvailable &&
            field.value?.trim() &&
            !errors.username && (
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
  );
};

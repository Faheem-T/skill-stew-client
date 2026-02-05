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
import type { FormValues } from "../../schemas";
import { useUsernameValidation } from "@/shared/hooks/useUsernameValidation";

interface UsernameFieldProps {
  currentUsername?: string;
}

export const UsernameField = ({ currentUsername }: UsernameFieldProps) => {
  const { control, watch, formState } = useFormContext<FormValues>();
  const { isAvailable, isChecking, debouncedUsername } = useUsernameValidation(
    watch("username"),
    currentUsername,
  );

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
            !formState.errors.username &&
            debouncedUsername !== currentUsername && (
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

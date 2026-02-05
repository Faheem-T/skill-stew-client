import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { FormValues } from "../../schemas";

export const NameField = () => {
  const { control } = useFormContext<FormValues>();

  return (
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

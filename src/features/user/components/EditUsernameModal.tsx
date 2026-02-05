import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import toast from "react-hot-toast";
import { updateUsernameRequest } from "@/shared/api/UpdateUsername";
import { useUsernameValidation } from "@/shared/hooks/useUsernameValidation";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

const usernameSchema = z.object({
  username: z
    .string()
    .min(5)
    .max(20)
    .regex(/^[a-zA-Z0-9._]+$/, "Only letters, numbers, . and _ allowed")
    .refine((v) => !v.startsWith(".") && !v.startsWith("_"), {
      message: "Username cannot start with '.' or '_'",
    })
    .refine((v) => !v.endsWith(".") && !v.endsWith("_"), {
      message: "Username cannot end with '.' or '_'",
    })
    .refine((v) => !/([._]{2})/.test(v), {
      message: "No consecutive '.' or '_'",
    }),
});

type UsernameFormValues = z.infer<typeof usernameSchema>;

interface EditUsernameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername?: string;
}

export const EditUsernameModal = ({
  open,
  onOpenChange,
  currentUsername,
}: EditUsernameModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  const form = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    mode: "onChange",
    defaultValues: {
      username: currentUsername || "",
    },
  });

  const watchedUsername = form.watch("username");

  // Use the shared username validation hook with form methods
  const { isAvailable: isUsernameAvailable, isChecking: isCheckingUsername } =
    useUsernameValidation({
      username: watchedUsername,
      currentUsername,
      setError: form.setError,
      clearErrors: form.clearErrors,
      errors: form.formState.errors,
      isDirty: form.formState.dirtyFields.username,
    });

  useEffect(() => {
    if (open) {
      form.reset({
        username: currentUsername || "",
      });
      setShowConfirmation(false);
      setConfirmationChecked(false);
    }
  }, [open, currentUsername, form]);

  const onSubmit = async (values: UsernameFormValues) => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    try {
      setIsSaving(true);
      await updateUsernameRequest(values.username);
      toast.success("Username updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update username. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmChange = (checked: boolean) => {
    setConfirmationChecked(checked);
  };

  const getUsernameStatus = () => {
    if (!watchedUsername || watchedUsername === currentUsername) return null;

    if (isCheckingUsername) {
      return (
        <div className="flex items-center gap-2 text-stone-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Checking availability...</span>
        </div>
      );
    }

    if (isUsernameAvailable) {
      return (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>Username is available!</span>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-stone-900">
            Change Username
          </DialogTitle>
          <DialogDescription>
            Choose a new username for your account. This will be visible to
            other users.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!showConfirmation ? (
              <>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username"
                          {...field}
                          disabled={isSaving}
                        />
                      </FormControl>
                      <FormDescription>
                        5-20 characters. Letters, numbers, dots, and underscores
                        only.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {getUsernameStatus()}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isUsernameAvailable || isSaving}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Continue
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Alert
                  variant="default"
                  className="border-amber-200 bg-amber-50"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-stone-700">
                    <strong className="font-semibold">Important:</strong>{" "}
                    Changing your username will update how others see and find
                    you on the platform. Your current username{" "}
                    <span className="font-mono bg-stone-200 px-1 rounded">
                      @{currentUsername}
                    </span>{" "}
                    will be changed to{" "}
                    <span className="font-mono bg-stone-200 px-1 rounded">
                      @{watchedUsername}
                    </span>
                    .
                  </AlertDescription>
                </Alert>

                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      id="confirmation"
                      checked={confirmationChecked}
                      onChange={(e) => handleConfirmChange(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-stone-300 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <label
                      htmlFor="confirmation"
                      className="text-sm font-normal cursor-pointer"
                    >
                      I understand that I am changing my username
                    </label>
                  </div>
                </FormItem>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    disabled={isSaving}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={!confirmationChecked || isSaving}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isSaving ? "Updating..." : "Confirm Change"}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

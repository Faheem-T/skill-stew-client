import { useEffect } from "react";
import type {
  UseFormSetError,
  UseFormClearErrors,
  FieldErrors,
} from "react-hook-form";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useCheckUsernameAvailability } from "@/shared/hooks/useCheckUsernameAvailability";

interface UseUsernameValidationOptions {
  username: string | undefined;
  currentUsername: string | undefined;
  setError: UseFormSetError<any>;
  clearErrors: UseFormClearErrors<any>;
  errors: FieldErrors;
  isDirty?: boolean;
}

interface UseUsernameValidationReturn {
  isAvailable: boolean;
  isChecking: boolean;
}

/**
 * Hook for validating username availability with debouncing.
 * Handles three types of validation errors:
 * 1. Zod schema errors (format, length) - managed by react-hook-form
 * 2. "This is your current username" - when user re-enters their existing username
 * 3. "Username is already taken" - from availability API check
 */
export const useUsernameValidation = ({
  username,
  currentUsername,
  setError,
  clearErrors,
  errors,
  isDirty = false,
}: UseUsernameValidationOptions): UseUsernameValidationReturn => {
  const debouncedUsername = useDebounce(username, 500);

  const hasZodError = !!errors?.username && errors.username.type !== "manual";
  const matchesCurrent = debouncedUsername === currentUsername;
  const isSettled = debouncedUsername === username;

  const shouldCheck =
    isSettled && !matchesCurrent && !!debouncedUsername && !hasZodError;

  const { data, isLoading: isChecking } = useCheckUsernameAvailability(
    debouncedUsername || "",
    shouldCheck,
  );

  const isTaken = data?.data?.available === false;
  const isAvailable = data?.data?.available === true;

  // Sync custom errors with form state
  useEffect(() => {
    if (hasZodError || !debouncedUsername) {
      if (!hasZodError) clearErrors("username");
      return;
    }

    if (matchesCurrent && isDirty) {
      setError("username", {
        type: "manual",
        message: "This is your current username",
      });
    } else if (isTaken) {
      setError("username", {
        type: "manual",
        message: "Username is already taken",
      });
    } else if (!matchesCurrent) {
      clearErrors("username");
    }
  }, [
    debouncedUsername,
    matchesCurrent,
    isDirty,
    hasZodError,
    isTaken,
    setError,
    clearErrors,
  ]);

  return { isAvailable, isChecking };
};

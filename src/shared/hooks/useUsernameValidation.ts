import { useEffect } from "react";
import type {
  UseFormSetError,
  UseFormClearErrors,
  FieldErrors,
} from "react-hook-form";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useCheckUsernameAvailability } from "@/shared/hooks/useCheckUsernameAvailability";

export interface UseUsernameValidationOptions {
  username: string | undefined;
  currentUsername: string | undefined;
  setError: UseFormSetError<any>;
  clearErrors: UseFormClearErrors<any>;
  errors: FieldErrors;
  isDirty?: boolean;
}

export interface UseUsernameValidationReturn {
  isAvailable: boolean;
  isChecking: boolean;
}

/**
 * Hook for validating username availability with debouncing
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

  const hasValidationErrors = !!errors?.username;
  const isSameAsCurrent = debouncedUsername === currentUsername;
  const shouldCheckAvailability =
    !isSameAsCurrent &&
    !!debouncedUsername &&
    debouncedUsername.length > 0 &&
    !hasValidationErrors;

  const { data: availabilityData, isLoading: isChecking } =
    useCheckUsernameAvailability(
      debouncedUsername || "",
      shouldCheckAvailability,
    );

  const isAvailable = availabilityData?.data?.available ?? false;

  // Sync availability state with form errors
  useEffect(() => {
    if (!debouncedUsername) return;

    // Only manage availability and current username errors
    // Don't touch Zod validation errors (format, length, etc.)
    if (isSameAsCurrent && isDirty) {
      setError("username", {
        type: "manual",
        message: "This is your current username",
      });
    } else if (
      !isSameAsCurrent &&
      availabilityData?.data?.available === false
    ) {
      setError("username", {
        type: "manual",
        message: "Username is already taken",
      });
    } else if (
      (!isSameAsCurrent && isAvailable && !hasValidationErrors) ||
      !debouncedUsername
    ) {
      // Only clear availability/current username errors, not Zod validation errors
      clearErrors("username");
    }
  }, [
    debouncedUsername,
    currentUsername,
    isSameAsCurrent,
    isAvailable,
    availabilityData,
    isDirty,
    hasValidationErrors,
    setError,
    clearErrors,
  ]);

  return { isAvailable, isChecking };
};

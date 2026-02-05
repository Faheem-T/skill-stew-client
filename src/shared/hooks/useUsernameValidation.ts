import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useCheckUsernameAvailability } from "@/shared/hooks/useCheckUsernameAvailability";

export interface UseUsernameValidationReturn {
  isAvailable: boolean;
  isChecking: boolean;
  debouncedUsername: string | undefined;
}

/**
 * Hook for validating username availability with debouncing
 * Syncs validation state with React Hook Form context
 * Requires form to be wrapped with FormProvider
 */
export const useUsernameValidation = (
  username: string | undefined,
  currentUsername: string | undefined,
): UseUsernameValidationReturn => {
  const { setError, clearErrors, formState, getFieldState } = useFormContext();
  const { errors } = formState;
  const { isDirty } = getFieldState("username");

  const debouncedUsername = useDebounce(username, 500);

  // Only check availability if validation passes and username changed
  const hasValidationErrors = !!errors.username;
  const shouldCheckAvailability =
    debouncedUsername !== currentUsername &&
    debouncedUsername &&
    debouncedUsername.length > 0 &&
    !hasValidationErrors &&
    isDirty;
  const { data: availabilityData, isLoading: isCheckingUsername } =
    useCheckUsernameAvailability(
      debouncedUsername || "",
      shouldCheckAvailability ? shouldCheckAvailability : false,
    );

  const isUsernameAvailable = availabilityData?.data?.available ?? false;

  // Sync availability state with form errors
  useEffect(() => {
    if (!debouncedUsername || !isDirty) {
      return;
    }

    if (debouncedUsername === currentUsername && debouncedUsername) {
      setError("username", {
        type: "manual",
        message: "This is your current username",
      });
    } else if (
      !isUsernameAvailable &&
      availabilityData?.data?.available === false
    ) {
      setError("username", {
        type: "manual",
        message: "Username is already taken",
      });
    } else if (isUsernameAvailable) {
      clearErrors("username");
    }
  }, [
    debouncedUsername,
    currentUsername,
    isUsernameAvailable,
    availabilityData,
    setError,
    clearErrors,
  ]);

  return {
    isAvailable: isUsernameAvailable,
    isChecking: isCheckingUsername,
    debouncedUsername,
  };
};

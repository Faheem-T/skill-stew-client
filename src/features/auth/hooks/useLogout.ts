import { logoutRequest } from "@/features/auth/api/LogoutRequest";
import { useAppStore } from "@/app/store";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  const logout = useAppStore((state) => state.logout);
  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      logout();
      window.location.reload();
    },
  });
}

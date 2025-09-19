import { logoutRequest } from "@/api/auth/LogoutRequest";
import { useAppStore } from "@/store";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  const logout = useAppStore((state) => state.logout);
  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      logout();
    },
  });
}

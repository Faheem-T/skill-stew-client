import { refreshRequest } from "@/features/auth/api/RefreshRequest";
import { useAppStore } from "@/app/store";
import { fetchProfile } from "@/features/auth/lib/fetchProfile";
import { queryClient } from "@/app/router";
import { CURRENT_USER_PROFILE_QUERY_KEY } from "@/shared/hooks/useCurrentUserProfile";

export const initialLoader = async () => {
  try {
    const { data } = await refreshRequest();
    useAppStore.getState().setAccessToken(data.accessToken);
    const profileData = await fetchProfile();
    queryClient.setQueryData(CURRENT_USER_PROFILE_QUERY_KEY, profileData);
    if (window.location.pathname === "/") {
      window.location.replace("/dashboard");
    }
  } catch {
    useAppStore.getState().logout();
  }
};

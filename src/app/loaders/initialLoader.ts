import { useAppStore } from "@/app/store";
import { fetchProfile } from "@/features/auth/lib/fetchProfile";
import { queryClient } from "@/app/router";
import { CURRENT_USER_PROFILE_QUERY_KEY } from "@/shared/hooks/useCurrentUserProfile";

export const initialLoader = async () => {
  try {
    const profileData = await fetchProfile();
    queryClient.setQueryData(CURRENT_USER_PROFILE_QUERY_KEY, profileData);
  } catch {
    useAppStore.getState().logout();
  }
};

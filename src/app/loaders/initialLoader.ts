import { refreshRequest } from "@/features/auth/api/RefreshRequest";
import { useAppStore } from "@/app/store";
import { fetchProfile } from "@/features/auth/lib/fetchProfile";

export const initialLoader = async () => {
  try {
    const { data } = await refreshRequest();
    useAppStore.getState().setAccessToken(data.accessToken);
    // await fetchProfile();
  } catch {
    useAppStore.getState().logout();
  }
};

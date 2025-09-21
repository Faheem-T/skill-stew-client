import { refreshRequest } from "@/api/auth/RefreshRequest";
import { useAppStore } from "@/store";
import { fetchProfile } from "./fetchProfile";

export const initialLoader = async () => {
  try {
    const { data } = await refreshRequest();
    useAppStore.getState().setAccessToken(data.accessToken);
    await fetchProfile();
  } catch {
    useAppStore.getState().logout();
  }
};

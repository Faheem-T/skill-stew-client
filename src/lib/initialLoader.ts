import { getProfile } from "@/api/auth/GetProfile";
import { refreshRequest } from "@/api/auth/RefreshRequest";
import { useAppStore } from "@/store";

export const initialLoader = async () => {
  try {
    const { data } = await refreshRequest();
    useAppStore.getState().setAccessToken(data.accessToken);
    const { data: profileData } = await getProfile();
    if (!profileData) {
      useAppStore.getState().logout();
      return;
    }

    if (profileData.role === "ADMIN") {
      const { id, role, username } = profileData;
      useAppStore.getState().setUser({ role, id, username });
    } else {
      const { id, role, username, name, email } = profileData;
      useAppStore.getState().setUser({ role, id, username, email, name });
    }
  } catch {
    useAppStore.getState().logout();
  }
};

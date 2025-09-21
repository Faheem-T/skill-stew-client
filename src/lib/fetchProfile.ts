import { getProfile } from "@/api/auth/GetProfile";
import { useAppStore } from "@/store";

export async function fetchProfile() {
  const { data } = await getProfile();
  if (!data) {
    useAppStore.getState().logout();
    return;
  }

  if (data.role === "ADMIN") {
    const { id, role, username } = data;
    useAppStore.getState().setUser({ role, id, username });
  } else {
    const { id, role, username, name, email } = data;
    useAppStore.getState().setUser({ role, id, username, email, name });
  }
}

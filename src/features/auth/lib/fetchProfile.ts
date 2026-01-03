import { useAppStore } from "@/app/store";
import getCurrentUserProfile from "@/shared/api/currentUserProfile";

export async function fetchProfile() {
  const { data } = await getCurrentUserProfile();
  if (!data) {
    useAppStore.getState().logout();
    return;
  }
  const { role, email } = data;
  useAppStore.getState().setUser({ role, email });
}

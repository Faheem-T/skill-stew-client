import { useAppStore } from "@/app/store";

export const initialLoader = async () => {
  try {
    // Add any initialization logic here, if needed
  } catch {
    useAppStore.getState().logout();
  }
};

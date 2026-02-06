import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface AuthSlice {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  accessToken: null,
  setAccessToken: (token: string) =>
    set((_state) => ({
      accessToken: token,
    })),
  logout: () => set((_state) => ({ accessToken: null })),
});

interface OnboardingSlice {
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (open: boolean) => void;
}

const createOnboardingSlice: StateCreator<
  OnboardingSlice,
  [],
  [],
  OnboardingSlice
> = (set) => ({
  isOnboardingModalOpen: false,
  setIsOnboardingModalOpen: (open: boolean) =>
    set((_state) => ({ isOnboardingModalOpen: open })),
});

export const useAppStore = create<AuthSlice & OnboardingSlice>()(
  devtools((...a) => ({
    ...createAuthSlice(...a),
    ...createOnboardingSlice(...a),
  })),
);

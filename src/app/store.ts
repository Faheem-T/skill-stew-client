import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

type User = {
  role: "USER" | "EXPERT" | "ADMIN";
  email: string;
};

interface AuthSlice {
  user: User | null;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  accessToken: null,
  setAccessToken: (token: string) =>
    set((_state) => ({
      accessToken: token,
    })),
  user: null,
  setUser: (user: User) => set((_state) => ({ user })),
  logout: () => set((_state) => ({ user: null, accessToken: null })),
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

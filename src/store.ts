import { create, type StateCreator } from "zustand";

type User =
  | { role: "USER" | "EXPERT"; email: string; username?: string }
  | { role: "ADMIN"; username: string };

interface AuthSlice {
  user: User | null;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
}

const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  accessToken: null,
  setAccessToken: (token: string) =>
    set((_state) => ({
      accessToken: token,
    })),
  user: null,
  setUser: (user: User) => set((_state) => ({ user })),
});

export const useAppStore = create<AuthSlice>()((...a) => ({
  ...createAuthSlice(...a),
}));

import { create } from "zustand";
import { api, type CurrentUser } from "../lib/api";

type AuthState = {
  user: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  loadUser: () => Promise<CurrentUser | null>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  loadUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await api.getCurrentUser();
      set({ user, isLoading: false });
      return user;
    } catch (cause) {
      set({
        user: null,
        isLoading: false,
        error: cause instanceof Error ? cause.message : "Nem sikerült ellenőrizni a belépést."
      });
      return null;
    }
  },
  logout: async () => {
    await api.logout();
    set({ user: null, isLoading: false, error: null });
  }
}));

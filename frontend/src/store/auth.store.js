import { getProfile } from "@/api-services/profile.service";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null }),

  initializeAuth: async () => {
    try {
      // GET PROFILE API CALL
      const response = await getProfile();

      // Set current user details
      set({ user: response.data });
    } catch (error) {
      console.error(
        "GET PROFILE API ERROR............",
        error.response?.data || error.message,
      );
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));

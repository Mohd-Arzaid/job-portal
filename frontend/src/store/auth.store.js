import { logoutUser } from "@/api-services/auth.service";
import { getProfile } from "@/api-services/profile.service";
import toast from "react-hot-toast";
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
      if (error.response?.status !== 401) {
        console.error(
          "GET PROFILE API ERROR............",
          error.response?.data || error.message,
        );
      }

      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      // LOGOUT API CALL
      const response = await logoutUser();

      // Clear the current user from the store
      set({ user: null });

      // Show a success message
      toast.success(response.message || "Logged out successfully!");
    } catch (error) {
      console.error(
        "LOGOUT API ERROR............",
        error.response?.data || error.message,
      );

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Logout failed. Please try again.";

      toast.error(errorMessage);

      throw error;
    }
  },
}));

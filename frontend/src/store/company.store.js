import { getCompany } from "@/api-services/company.service";
import { create } from "zustand";

export const useCompanyStore = create((set) => ({
  company: null,
  isLoading: true,

  setCompany: (company) => set({ company }),
  setLoading: (isLoading) => set({ isLoading }),
  clearCompany: () => set({ company: null }),

  initializeCompany: async () => {
    try {
      set({ isLoading: true });

      // GET COMPANY API CALL
      const response = await getCompany();

      // Set current company details in state
      set({ company: response?.data || null });

      return response?.data;
    } catch (error) {
      // Agar recruiter ne company register nahi ki hai (404), toh null set karo
      if (error.response?.status !== 404) {
        console.error(
          "GET COMPANY STORE ERROR............",
          error.response?.data || error.message,
        );
      }

      set({ company: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));

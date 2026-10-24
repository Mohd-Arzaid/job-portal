import { create } from "zustand";

export const useJobStore = create((set) => ({
  jobs: [],
  selectedJob: null,

  setJobs: (jobs) => set({ jobs }),
  clearJobs: () => set({ jobs: [] }),

  setSelectedJob: (job) => set({ selectedJob: job }),
  clearSelectedJob: () => set({ selectedJob: null }),
}));

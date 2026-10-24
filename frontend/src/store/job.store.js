import { create } from "zustand";

export const useJobStore = create((set) => ({
  jobs: [],
  selectedJob: null,
  appliedJobs: [],

  setJobs: (jobs) => set({ jobs }),
  clearJobs: () => set({ jobs: [] }),

  setSelectedJob: (job) => set({ selectedJob: job }),
  clearSelectedJob: () => set({ selectedJob: null }),

  setAppliedJobs: (appliedJobs) => set({ appliedJobs }),
}));

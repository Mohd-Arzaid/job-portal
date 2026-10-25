import { create } from "zustand";

export const useJobStore = create((set) => ({
  jobs: [],
  selectedJob: null,
  appliedJobs: [],

  // Recruiter specific state
  recruiterJobs: [],
  isRecruiterJobsLoading: false,

  setJobs: (jobs) => set({ jobs }),
  clearJobs: () => set({ jobs: [] }),

  setSelectedJob: (job) => set({ selectedJob: job }),
  clearSelectedJob: () => set({ selectedJob: null }),

  setAppliedJobs: (appliedJobs) => set({ appliedJobs }),

  // Recruiter actions
  setRecruiterJobs: (recruiterJobs) => set({ recruiterJobs }),
  addRecruiterJob: (newJob) =>
    set((state) => ({
      recruiterJobs: [newJob, ...(state.recruiterJobs || [])],
      jobs: [newJob, ...(state.jobs || [])],
    })),
  setRecruiterJobsLoading: (isRecruiterJobsLoading) =>
    set({ isRecruiterJobsLoading }),
  clearRecruiterJobs: () => set({ recruiterJobs: [] }),
}));

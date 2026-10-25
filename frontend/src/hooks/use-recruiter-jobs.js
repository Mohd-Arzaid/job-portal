// use-recruiter-jobs.js
// Custom Hook to fetch and manage recruiter's posted jobs

"use client";

import { useEffect, useState, useCallback } from "react";
import { getRecruiterJobs } from "@/api-services/job.service";
import { useJobStore } from "@/store/job.store";
import { useAuthStore } from "@/store/auth.store";

export default function useRecruiterJobs() {
  const user = useAuthStore((state) => state.user);
  const recruiterJobs = useJobStore((state) => state.recruiterJobs);
  const setRecruiterJobs = useJobStore((state) => state.setRecruiterJobs);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecruiterJobs = useCallback(async () => {
    if (!user || user.role !== "recruiter") return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getRecruiterJobs();
      if (response?.data) {
        setRecruiterJobs(response.data);
      }
    } catch (err) {
      console.error(
        "FETCH RECRUITER JOBS ERROR............",
        err?.response?.data || err?.message || err,
      );
      setError(err?.response?.data?.message || err?.message || "Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  }, [user, setRecruiterJobs]);

  useEffect(() => {
    fetchRecruiterJobs();
  }, [fetchRecruiterJobs]);

  return {
    recruiterJobs,
    isLoading,
    error,
    refetch: fetchRecruiterJobs,
  };
}

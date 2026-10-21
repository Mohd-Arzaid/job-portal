// A custom hook is a Javascript function whose name
// starts with "use" and that can use React hooks.

// Why do we create custom hooks?
// The purpose is to keep reusable stateful logic
// in one place so multiple components can reuse it.

// A custom hook can return state, functions, or any other values that a component needs

"use client";

import { getAllJobs } from "@/api-services/job.service";
import { useJobStore } from "@/store/job.store";
import { useCallback, useEffect, useState } from "react";

export default function useJobs(params = {}) {
  const jobs = useJobStore((state) => state.jobs);
  const setJobs = useJobStore((state) => state.setJobs);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // GET ALL JOBS API CALL
      const response = await getAllJobs(params);

      if (response?.data) {
        // Store ke andar jobs save kar rahe hain
        setJobs(response.data);
      }

      return response;
    } catch (error) {
      console.error(
        "GET ALL JOBS HOOK ERROR............",
        error?.response?.data || error?.message || error,
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch jobs. Please try again.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [params, setJobs]);

  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  return {
    jobs,
    isLoading,
    error,
    fetchAllJobs,
  };
}

"use client";

import { getAppliedJobs } from "@/api-services/application.service";
import { useJobStore } from "@/store/job.store";
import { useCallback, useEffect, useState } from "react";

export default function useAppliedJobs() {
  const appliedJobs = useJobStore((state) => state.appliedJobs);
  const setAppliedJobs = useJobStore((state) => state.setAppliedJobs);

  const [isLoading, setIsLoading] = useState(appliedJobs.length === 0);
  const [error, setError] = useState(null);

  // Student ki apply ki gayi saari jobs fetch karne ka function
  const fetchAppliedJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // GET APPLIED JOBS API CALL
      const response = await getAppliedJobs();

      if (response?.data) {
        setAppliedJobs(response.data);
      }

      return response;
    } catch (error) {
      console.error(
        "GET APPLIED JOBS HOOK ERROR............",
        error?.response?.data || error?.message || error,
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch applied jobs. Please try again.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppliedJobs();
  }, [fetchAppliedJobs]);

  return {
    appliedJobs,
    isLoading,
    error,
    fetchAppliedJobs,
  };
}

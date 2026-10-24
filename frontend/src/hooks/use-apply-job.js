// use-apply-job.js

// A custom hook is a JavaScript function whose name
// starts with "use" and that can use React hooks.

// Why do we create custom hooks?
// The purpose is to keep reusable stateful logic
// in one place so multiple components can reuse it.

// A custom hook can return state, functions,
// or any other values that a component needs

"use client";

import { getAppliedJobs } from "@/api-services/application.service";
import { applyForJob } from "@/api-services/application.service";
import { useAuthStore } from "@/store/auth.store";
import { useJobStore } from "@/store/job.store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useApplyJob(jobId) {
  const user = useAuthStore((state) => state.user);
  const appliedJobs = useJobStore((state) => state.appliedJobs);
  const setAppliedJobs = useJobStore((state) => state.setAppliedJobs);

  // Track karo ki apply button click hua hai ya nahi (loading spinner ke liye)
  const [isApplying, setIsApplying] = useState(false);

  // Check karo ki store mein yeh job pehle se applied list mein hai ya nahi
  const isJobAlreadyApplied = Boolean(
    jobId &&
    appliedJobs?.some(
      (application) =>
        application.job?._id === jobId || application.job === jobId,
    ),
  );

  // Track karo ki student pehle se apply kar chuka hai ya nahi (UI state ke liye)
  const [hasApplied, setHasApplied] = useState(isJobAlreadyApplied);

  // Jab bhi jobId ya appliedJobs badle, check update karo
  useEffect(() => {
    if (isJobAlreadyApplied) {
      setHasApplied(true);
    }
  }, [isJobAlreadyApplied]);

  // Agar user logged in student hai aur store khali hai, toh background mein check karo
  useEffect(() => {
    if (!user || user.role !== "student" || !jobId) return;
    // Agar pehle se store mein hai toh API dubara call mat karo
    if (isJobAlreadyApplied) return;

    const checkAppliedStatus = async () => {
      try {
        const response = await getAppliedJobs();

        if (response?.data) {
          const appliedApplications = response.data;

          setAppliedJobs(appliedApplications);

          const isJobAlreadyApplied = appliedApplications.some(
            (application) =>
              application.job?._id === jobId || application.job === jobId,
          );

          if (isJobAlreadyApplied) {
            setHasApplied(true);
          }
        }
      } catch (err) {
        // Guest user ya network issue hone par quietly ignore karo
      }
    };

    checkAppliedStatus();
  }, [user, jobId, isJobAlreadyApplied, setAppliedJobs]);

  const handleApply = async (idToApply = jobId) => {
    // Agar pehle se apply ho chuka hai ya apply chal raha hai toh duplicate call mat karo
    if (isApplying || hasApplied) return;

    setIsApplying(true);

    try {
      // APPLY FOR JOB API CALL
      const response = await applyForJob(idToApply);

      // Apply successful hone par state update karo
      setHasApplied(true);

      // Store mein bhi update karo taaki Pure App (Profile Table wagaira) mein turant sync ho jaye
      if (response?.data) {
        setAppliedJobs([response.data, ...(appliedJobs || [])]);
      }

      // Success toast dikhao
      toast.success(response?.message || "Applied successfully!");

      return response;
    } catch (error) {
      console.error(
        "APPLY FOR JOB HOOK ERROR............",
        error?.response?.data || error?.message || error,
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to apply. Please try again.";

      // 409 Conflict → Already applied
      if (error?.response?.status === 409) {
        toast.error("You have already applied for this job.");
        setHasApplied(true); // UI ko bhi update karo
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsApplying(false);
    }
  };

  return {
    isApplying,
    hasApplied,
    handleApply,
  };
}

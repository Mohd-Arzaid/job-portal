// use-apply-job.js

// A custom hook is a JavaScript function whose name
// starts with "use" and that can use React hooks.

// Why do we create custom hooks?
// The purpose is to keep reusable stateful logic
// in one place so multiple components can reuse it.

// A custom hook can return state, functions,
// or any other values that a component needs

"use client";

import { applyForJob } from "@/api-services/application.service";
import { useState } from "react";
import toast from "react-hot-toast";

export default function useApplyJob() {
  // Track karo ki apply button click hua hai ya nahi (loading spinner ke liye)
  const [isApplying, setIsApplying] = useState(false);

  // Track karo ki student pehle se apply kar chuka hai ya nahi (UI state ke liye)
  const [hasApplied, setHasApplied] = useState(false);

  const handleApply = async (jobId) => {
    // Agar pehle se apply ho chuka hai ya apply chal raha hai toh duplicate call mat karo
    if (isApplying || hasApplied) return;

    setIsApplying(true);

    try {
      // APPLY FOR JOB API CALL
      const response = await applyForJob(jobId);

      // Apply successful hone par state update karo
      setHasApplied(true);

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

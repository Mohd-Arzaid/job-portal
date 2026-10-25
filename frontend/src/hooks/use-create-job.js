// use-create-job.js
// Custom Hook for handling Job Creation by Recruiters

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { createJob } from "@/api-services/job.service";
import { useCompanyStore } from "@/store/company.store";
import { useJobStore } from "@/store/job.store";

/**
 * useCreateJob hook handles the entire job creation workflow:
 * 1. Checks if the recruiter has an active registered company
 * 2. Formats and validates the job payload
 * 3. Calls the createJob API
 * 4. Optimistically updates the Zustand job store (recruiterJobs)
 * 5. Shows informative success/error toasts
 * 6. Redirects the recruiter to their job postings list
 */
export default function useCreateJob() {
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const router = useRouter();

  const company = useCompanyStore((state) => state.company);
  const addRecruiterJob = useJobStore((state) => state.addRecruiterJob);

  const handleCreateJob = async (jobFormData) => {
    // Edge Case 1: Recruiter ne company register nahi ki hai
    if (!company) {
      toast.error("Please register your company before posting a job.");
      router.push("/recruiter/company");
      return { success: false, message: "Company registration required" };
    }

    // Duplicate call prevention
    if (isCreatingJob) return;

    setIsCreatingJob(true);

    try {
      // Clean and properly cast payload values
      const formattedJobPayload = {
        title: jobFormData.title?.trim(),
        description: jobFormData.description?.trim(),
        requirements: Array.isArray(jobFormData.requirements)
          ? jobFormData.requirements.map((item) => item.trim()).filter(Boolean)
          : [],
        salary: Number(jobFormData.salary),
        experienceLevel: Number(jobFormData.experienceLevel),
        location: Array.isArray(jobFormData.location)
          ? jobFormData.location.map((item) => item.trim()).filter(Boolean)
          : [],
        jobType: jobFormData.jobType,
        position: Number(jobFormData.position),
      };

      console.log("SENDING CREATE JOB PAYLOAD............", formattedJobPayload);

      // CREATE JOB API CALL
      const response = await createJob(formattedJobPayload);

      // Agar job successfully create ho gayi:
      if (response?.data) {
        // Zustand store mein add karo taaki recruiter ke list mein turant reflect ho
        addRecruiterJob(response.data);
      }

      // Success toast
      toast.success(response?.message || "Job posted successfully!");

      // Recruiter dashboard ya jobs list par redirect karo
      router.push("/recruiter/jobs");

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "CREATE JOB HOOK ERROR............",
        error?.response?.data || error?.message || error,
      );

      // Backend status code specific handling
      const status = error?.response?.status;
      const backendMessage = error?.response?.data?.message;
      const validationErrors = error?.response?.data?.errors;

      if (status === 404) {
        toast.error(backendMessage || "Please register your company first.");
        router.push("/recruiter/company");
      } else if (status === 400 && Array.isArray(validationErrors)) {
        // Backend Zod issues array
        toast.error(validationErrors[0] || "Validation failed on server.");
      } else if (status === 403) {
        toast.error("Access denied: Only recruiters can create jobs.");
      } else {
        toast.error(
          backendMessage ||
            error?.message ||
            "Failed to create job. Please try again.",
        );
      }

      return {
        success: false,
        error: backendMessage || error.message,
      };
    } finally {
      setIsCreatingJob(false);
    }
  };

  return {
    handleCreateJob,
    isCreatingJob,
  };
}

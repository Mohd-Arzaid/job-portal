// application.service.js
import axios from "axios";
import { applicationEndpoints } from "./api";

const {
  APPLY_JOB_API,
  GET_APPLIED_JOBS_API,
  GET_APPLICANTS_API,
  UPDATE_APPLICATION_STATUS_API,
} = applicationEndpoints;

// POST /api/v1/application/:jobId/apply
// Logged-in student ko ek specific job ke liye apply karne ki API call
export const applyForJob = async (jobId) => {
  const response = await axios.post(
    `${APPLY_JOB_API}/${jobId}/apply`,
    {}, // POST body empty hai, jobId URL mein hi hai
    {
      withCredentials: true, // JWT cookie backend ko bhejne ke liye
    },
  );

  console.log("APPLY FOR JOB API RESPONSE............", response);

  console.log(
    "APPLY FOR JOB API SUCCESS RESPONSE............",
    response?.data?.success,
  );

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to apply for job");
  }

  return response.data;
};

// GET /api/v1/application/applied-jobs
// Logged-in student ki saari applied jobs fetch karne ki API call
export const getAppliedJobs = async () => {
  const response = await axios.get(GET_APPLIED_JOBS_API, {
    withCredentials: true, // JWT cookie backend ko bhejne ke liye
  });

  console.log("GET APPLIED JOBS API RESPONSE............", response);

  console.log(
    "GET APPLIED JOBS API SUCCESS RESPONSE............",
    response?.data?.success,
  );

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to fetch applied jobs");
  }

  return response.data;
};

// GET /api/v1/application/:jobId/applicants
// Recruiter ke liye ek specific job ke saare applicants fetch karne ki API call
export const getApplicants = async (jobId) => {
  const response = await axios.get(`${GET_APPLICANTS_API}/${jobId}/applicants`, {
    withCredentials: true,
  });

  console.log("GET APPLICANTS API RESPONSE............", response);

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to fetch applicants");
  }

  return response.data;
};

// PUT /api/v1/application/:applicationId/status
// Recruiter ke liye application status update karne ki API call
export const updateApplicationStatus = async (applicationId, status) => {
  const response = await axios.put(
    `${UPDATE_APPLICATION_STATUS_API}/${applicationId}/status`,
    { status },
    { withCredentials: true },
  );

  console.log("UPDATE APPLICATION STATUS API RESPONSE............", response);

  if (!response?.data?.success) {
    throw new Error(
      response?.data?.message || "Failed to update application status",
    );
  }

  return response.data;
};

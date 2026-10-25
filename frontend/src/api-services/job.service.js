import axios from "axios";
import { jobEndpoints } from "./api";

const {
  GET_ALL_JOBS_API,
  GET_JOB_BY_ID_API,
  CREATE_JOB_API,
  GET_RECRUITER_JOBS_API,
} = jobEndpoints;

// Fetch all Jobs with optional query params (Keyword, Page, Limit)
export const getAllJobs = async (params = {}) => {
  const response = await axios.get(GET_ALL_JOBS_API, {
    params,
    withCredentials: true,
  });

  console.log("GET ALL JOBS API RESPONSE............", response);

  console.log(
    "GET ALL JOBS API SUCCESS RESPONSE............",
    response?.data?.success,
  );

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to fetch jobs");
  }

  return response.data;
};

// Fetch single job details by ID
export const getJobById = async (id) => {
  const response = await axios.get(`${GET_JOB_BY_ID_API}/${id}`, {
    withCredentials: true,
  });

  console.log("GET JOB BY ID API RESPONSE............", response);

  console.log(
    "GET JOB BY ID API SUCCESS RESPONSE............",
    response?.data?.success,
  );

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to fetch job details");
  }

  return response.data;
};

// Create a new Job posting (Recruiter only)
export const createJob = async (jobPayload) => {
  const response = await axios.post(CREATE_JOB_API, jobPayload, {
    withCredentials: true,
  });

  console.log("CREATE JOB API RESPONSE............", response);

  console.log(
    "CREATE JOB API SUCCESS RESPONSE............",
    response?.data?.success,
  );

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to create job");
  }

  return response.data;
};

// Fetch all jobs posted by the logged-in recruiter
export const getRecruiterJobs = async () => {
  const response = await axios.get(GET_RECRUITER_JOBS_API, {
    withCredentials: true,
  });

  console.log("GET RECRUITER JOBS API RESPONSE............", response);

  console.log(
    "GET RECRUITER JOBS API SUCCESS RESPONSE............",
    response?.data?.success,
  );

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to fetch recruiter jobs");
  }

  return response.data;
};

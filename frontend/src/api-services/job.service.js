import axios from "axios";
import { jobEndpoints } from "./api";

const { GET_ALL_JOBS_API } = jobEndpoints;

// Fetch all Jobs with optional query params (Keyword, Page, Limit)
export const getAllJobs = async () => {
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

// application.service.js
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// POST /api/v1/application/:jobId/apply
// Logged-in student ko ek specific job ke liye apply karne ki API call
export const applyForJob = async (jobId) => {
  const response = await axios.post(
    `${BASE_URL}/application/${jobId}/apply`,
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

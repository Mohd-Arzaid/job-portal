const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// AUTH ENDPOINTS
export const authEndpoints = {
  REGISTER_API: BASE_URL + "/user/register",
  LOGIN_API: BASE_URL + "/user/login",
  LOGOUT_API: BASE_URL + "/user/logout",
};

export const profileEndpoints = {
  PROFILE_API: BASE_URL + "/user/profile",
};

export const jobEndpoints = {
  GET_ALL_JOBS_API: BASE_URL + "/job/all",
  GET_JOB_BY_ID_API: BASE_URL + "/job",
  CREATE_JOB_API: BASE_URL + "/job/create",
  GET_RECRUITER_JOBS_API: BASE_URL + "/job/recruiter",
};

export const applicationEndpoints = {
  APPLY_JOB_API: BASE_URL + "/application",
  GET_APPLIED_JOBS_API: BASE_URL + "/application/applied-jobs",
  GET_APPLICANTS_API: BASE_URL + "/application",
  UPDATE_APPLICATION_STATUS_API: BASE_URL + "/application",
};

export const companyEndpoints = {
  REGISTER_COMPANY_API: BASE_URL + "/company/register",
  GET_COMPANY_API: BASE_URL + "/company/get",
};


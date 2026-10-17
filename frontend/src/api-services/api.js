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

import axios from "axios";
import { profileEndpoints } from "./api";

const { PROFILE_API } = profileEndpoints;

export const getProfile = async () => {
  const response = await axios.get(PROFILE_API, {
    withCredentials: true,
  });

  console.log("GET PROFILE API RESPONSE............", response);

  console.log(
    "GET PROFILE API SUCCESS RESPONSE............",
    response?.data?.success,
  );

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to fetch profile");
  }

  return response.data;
};

import axios from "axios";
import { authEndpoints } from "./api";

const { REGISTER_API, LOGIN_API } = authEndpoints;

export const registerUser = async (formData) => {
  const response = await axios.post(REGISTER_API, formData);

  console.log("REGISTER API RESPONSE............", response);

  console.log(
    "REGISTER API SUCCESS RESPONSE............",
    response.data.success,
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Registration failed");
  }

  return response.data;
};

export const loginUser = async (data) => {
  const response = await axios.post(LOGIN_API, data, {
    withCredentials: true, // JWT cookie backend se receive karne ke liye
  });

  console.log("LOGIN API RESPONSE............", response);

  console.log(
    "LOGIN API SUCCESS RESPONSE............",
    response.data.success,
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Login failed");
  }

  return response.data;
};

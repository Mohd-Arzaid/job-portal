import axios from "axios";
import { endpoints } from "./api";

const { REGISTER_API } = endpoints;

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
